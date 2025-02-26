import { Layer, Source, useMap } from 'react-map-gl';
import { useEffect, useState } from 'react';
import { DestroyRoad } from './destroy-road';
import { FixRoad } from './fix-road';
import { useSession } from 'next-auth/react';

interface RenderRoadNetworkProps {
    fixedRoadNetworkData: any;
    isMapLoaded: boolean;
    visibility: { roadNetwork: boolean };
    fetchFixedRoadsByBounds: () => void;
}

export const RenderRoadNetwork = ({ fixedRoadNetworkData, isMapLoaded, visibility, fetchFixedRoadsByBounds }: RenderRoadNetworkProps) => {
    const { data: session } = useSession();
    const { current: map } = useMap();

    const [selectedRoadId, setSelectedRoadId] = useState<string>();
    const [isDamaged, setIsDamaged] = useState<boolean>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    let hoveredRoadId: string | null = null;

    useEffect(() => {
        if (!map || !isMapLoaded) return;

        const handleLayerClick = (e: any) => {
            const road = map.queryRenderedFeatures(e.point, { layers: ['road_layer'] });

            if (!road || road.length === 0) return;

            const clickedRoad = road[0];
            const clickedRoadId = clickedRoad.properties?.id;

            if (!selectedRoadId) {
                setSelectedRoadId(clickedRoadId);
                setIsDamaged(clickedRoad.properties?.is_damaged);
                setIsDialogOpen(true);
            }
        };

        const handleMouseMove = (e: any) => {
            const features = map.queryRenderedFeatures(e.point, { layers: ['road_layer'] });

            if (features.length > 0) {
                const road = features[0];

                console.log(road);
                map.getCanvas().style.cursor = 'pointer';

                // Reset the previous hover state
                if (hoveredRoadId !== null) {
                    map.setFeatureState({ source: 'road-network-source', id: hoveredRoadId }, { hover: false });
                }

                // Set the hover state for the current road
                if (road.id !== undefined) {
                    hoveredRoadId = road.id as string;

                    map.setFeatureState({ source: 'road-network-source', id: hoveredRoadId }, { hover: true });
                }
            }
        };

        const handleMouseLeave = () => {
            if (hoveredRoadId !== null) {
                map.getCanvas().style.cursor = 'grab';
                map.setFeatureState({ source: 'road-network-source', id: hoveredRoadId }, { hover: false });
            }
            hoveredRoadId = null;
        };

        map.on('click', 'road_layer', handleLayerClick);
        map.on('mousemove', 'road_layer', handleMouseMove);
        map.on('mouseleave', 'road_layer', handleMouseLeave);

        return () => {
            map.off('click', 'road_layer', handleLayerClick);
            map.off('mousemove', 'road_layer', handleMouseMove);
            map.off('mouseleave', 'road_layer', handleMouseLeave);
        };
    }, [map, isMapLoaded]);

    if (!isMapLoaded) return null;

    return (
        <>
            <Source
                id='road-network-source'
                type='geojson'
                data={{
                    type: 'FeatureCollection',
                    features: Array.isArray(fixedRoadNetworkData) ? fixedRoadNetworkData : [fixedRoadNetworkData],
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

            {/* {isDialogOpen &&
                session &&
                (isDamaged ? (
                    <FixRoad
                        setIsDialogOpen={setIsDialogOpen}
                        roadId={selectedRoadId}
                        fetchRoadByBounds={fetchRoadByBounds}
                    />
                ) : (
                    <DestroyRoad
                        setIsDialogOpen={setIsDialogOpen}
                        roadId={selectedRoadId}
                        fetchRoadByBounds={fetchRoadByBounds}
                    />
                ))} */}
        </>
    );
};
