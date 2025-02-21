import { Layer, Source, useMap } from 'react-map-gl';
import { useEffect, useState } from 'react';

interface RenderRoadNetworkProps {
    geoJsonData: any;
    isMapLoaded: boolean;
    visibility: { roadNetwork: boolean };
    selectedAction: string | null;
}

export const RenderRoadNetwork = ({ geoJsonData, isMapLoaded, visibility, selectedAction }: RenderRoadNetworkProps) => {
    const { current: map } = useMap();

    const [isDestroyDialogOpen, setIsDestroyDialogOpen] = useState(false);

    let hoveredRoadId: string | null = null;

    useEffect(() => {
        if (!map || !isMapLoaded) return;

        const handleLayerClick = (e: any) => {
            const road = map.queryRenderedFeatures(e.point, { layers: ['road_layer'] });

            if (!road || road.length === 0) return;

            const clickedRoad = road[0];
            console.log('handleClick', road);
            const clickedRoadId = clickedRoad.properties?.id;
        };

        const handleMouseMove = (e: any) => {
            const features = map.queryRenderedFeatures(e.point, { layers: ['road_layer'] });

            if (features.length > 0) {
                const road = features[0];

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
                    features: [...geoJsonData.RoadNetwork],
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
        </>
    );
};
