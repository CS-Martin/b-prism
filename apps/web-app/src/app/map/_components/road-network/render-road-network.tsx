import { Layer, Source, useMap } from 'react-map-gl';
import { useEffect, useState, useRef } from 'react';
import { FixRoadModal } from './fix-road-modal';
import { DestroyRoadModal } from './destroy-road-modal';
import { useRoadNetworkStore } from 'apps/web-app/src/stores/map-stores/road-network.store';
import { useMapStore } from 'apps/web-app/src/stores/map-stores/mapbox.store';
import { Session } from 'next-auth';
import { GeoJSONFeature } from 'mapbox-gl';

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

    const [selectedRoad, setSelectedRoad] = useState<GeoJSONFeature | null>(null);
    const [isDamaged, setIsDamaged] = useState<boolean | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const hoveredRoadId = useRef<string | null>(null);

    useEffect(() => {
        if (!map) return;

        const handleLayerClick = (e: any) => {
            const road = map.queryRenderedFeatures(e.point, { layers: ['road_layer'] });

            if (!road || road.length === 0) return;

            const clickedRoad = road[0];

            setSelectedRoad(clickedRoad);
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
    }, [map, selectedRoad]);

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
                            ['==', ['get', 'severity'], 1],
                            'yellow', // Yellow
                            ['==', ['get', 'severity'], 2],
                            'orange', // Orange
                            ['==', ['get', 'severity'], 3],
                            'red', // Red
                            ['==', ['get', 'is_damaged'], true],
                            'red', // Fallback red for any damaged roads without severity
                            'green', // Green for normal roads (not damaged)
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
                selectedRoad &&
                (isDamaged ? (
                    <FixRoadModal
                        setIsDialogOpen={setIsDialogOpen}
                        road={selectedRoad}
                        session={session}
                    />
                ) : (
                    <DestroyRoadModal
                        setIsDialogOpen={setIsDialogOpen}
                        road={selectedRoad}
                        session={session}
                    />
                ))}
        </>
    );
};
