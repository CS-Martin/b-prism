import { Layer, Source, useMap } from 'react-map-gl';
import { useEffect, useState, useRef } from 'react';
import { FixRoadModal } from './fix-road-modal';
import { DestroyRoadModal } from './destroy-road-modal';
import { useRoadNetworkStore } from 'apps/web-app/src/stores/map-stores/road-network.store';
import { useMapStore } from 'apps/web-app/src/stores/map-stores/mapbox.store';
import { Session } from 'next-auth';

interface RenderRoadNetworkProps {
    visibility: { roadNetwork: boolean };
    session?: Session | null;
}

export const RenderRoadNetwork = ({ visibility, session }: RenderRoadNetworkProps) => {
    const { current: map } = useMap();

    const { fixedRoads, damagedRoads, fetchDamagedRoads, fetchFixedRoadsByBounds } = useRoadNetworkStore();
    const mapRef = useMapStore((state) => state.mapRef);

    useEffect(() => {
        if (mapRef?.current) {
            const mapboxMap = mapRef.current;
            fetchDamagedRoads();

            mapboxMap.on('moveend', () => fetchFixedRoadsByBounds(mapRef));

            return () => {
                mapboxMap.off('moveend', () => fetchFixedRoadsByBounds(mapRef));
            };
        }
    }, [mapRef]);

    const [selectedRoadId, setSelectedRoadId] = useState<string | null>(null);
    const [isDamaged, setIsDamaged] = useState<boolean | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const hoveredRoadId = useRef<string | null>(null);

    useEffect(() => {
        if (!map) return;

        const handleLayerClick = (e: any) => {
            const road = map.queryRenderedFeatures(e.point, { layers: ['road_layer'] });

            if (!road || road.length === 0) return;

            const clickedRoad = road[0];
            const clickedRoadId = clickedRoad.properties?.id;

            setSelectedRoadId(clickedRoadId);
            setIsDamaged(clickedRoad.properties?.is_damaged ?? false);
            setIsDialogOpen(true);
        };

        const handleMouseMove = (e: any) => {
            const features = map.queryRenderedFeatures(e.point, { layers: ['road_layer'] });

            if (features.length > 0) {
                const road = features[0];

                map.getCanvas().style.cursor = 'pointer';

                // Reset the previous hover state
                if (hoveredRoadId.current !== null) {
                    map.setFeatureState({ source: 'road-network-source', id: hoveredRoadId.current }, { hover: false });
                }

                // Set the hover state for the current road
                if (road.id !== undefined) {
                    hoveredRoadId.current = road.id as string;
                    map.setFeatureState({ source: 'road-network-source', id: hoveredRoadId.current }, { hover: true });
                }
            }
        };

        const handleMouseLeave = () => {
            if (hoveredRoadId.current !== null) {
                map.getCanvas().style.cursor = 'grab';
                map.setFeatureState({ source: 'road-network-source', id: hoveredRoadId.current }, { hover: false });
            }
            hoveredRoadId.current = null;
        };

        map.on('click', 'road_layer', handleLayerClick);
        map.on('mousemove', 'road_layer', handleMouseMove);
        map.on('mouseleave', 'road_layer', handleMouseLeave);

        return () => {
            map.off('click', 'road_layer', handleLayerClick);
            map.off('mousemove', 'road_layer', handleMouseMove);
            map.off('mouseleave', 'road_layer', handleMouseLeave);
        };
    }, [map, selectedRoadId]);

    return (
        <>
            <Source
                id='road-network-source'
                type='geojson'
                data={{
                    type: 'FeatureCollection',
                    features: [...fixedRoads, ...damagedRoads],
                }}>
                <Layer
                    id='road_layer'
                    type='line'
                    paint={{
                        'line-width': [
                            'case',
                            ['boolean', ['feature-state', 'hover'], false],
                            12, // Width when hovered
                            5, // Default width
                        ],
                        'line-color': [
                            'case',
                            ['==', ['get', 'is_damaged'], true],
                            'red', // Red for damaged roads
                            'green', // Green for undamaged roads
                        ],
                        'line-opacity': [
                            'case',
                            ['boolean', ['feature-state', 'hover'], false],
                            1, // Fully visible when hovered
                            0.6, // Slightly transparent otherwise
                        ],
                    }}
                />
            </Source>

            {isDialogOpen &&
                session &&
                selectedRoadId &&
                (isDamaged ? (
                    <FixRoadModal
                        setIsDialogOpen={setIsDialogOpen}
                        roadId={selectedRoadId}
                        session={session}
                    />
                ) : (
                    <DestroyRoadModal
                        setIsDialogOpen={setIsDialogOpen}
                        roadId={selectedRoadId}
                        session={session}
                    />
                ))}
        </>
    );
};
