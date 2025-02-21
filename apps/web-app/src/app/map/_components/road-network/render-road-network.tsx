import { Layer, Source, useMap } from 'react-map-gl';
import { useEffect } from 'react';

interface RenderRoadNetworkProps {
    geoJsonData: any;
    isMapLoaded: boolean;
    visibility: { roadNetwork: boolean };
    selectedAction: string | null;
}

export const RenderRoadNetwork = ({ geoJsonData, isMapLoaded, visibility, selectedAction }: RenderRoadNetworkProps) => {
    const { current: map } = useMap();

    let hoveredRoadId: string | null = null;

    useEffect(() => {
        if (!map || !isMapLoaded) return;

        const handleMouseMove = (e: any) => {
            const features = map.queryRenderedFeatures(e.point, { layers: ['road_layer'] });

            if (features.length > 0) {
                const road = features[0];
                console.log(features);
                console.log(road, 'HAHAHAHAHA');

                // Reset the previous hover state
                if (hoveredRoadId !== null) {
                    map.setFeatureState({ source: 'road-network-source', id: hoveredRoadId }, { hover: false });
                }

                // Set the hover state for the current road
                if (road.id !== undefined) {
                    hoveredRoadId = road.id as string;

                    console.log('here hovered', hoveredRoadId);
                    map.setFeatureState({ source: 'road-network-source', id: hoveredRoadId }, { hover: true });
                }
            }
        };

        const handleMouseLeave = () => {
            console.log('Handle mouse leave');
            if (hoveredRoadId !== null) {
                map.setFeatureState({ source: 'road-network-source', id: hoveredRoadId }, { hover: false });
            }
            hoveredRoadId = null;
        };

        map.on('mousemove', 'road_layer', handleMouseMove);
        map.on('mouseleave', 'road_layer', handleMouseLeave);

        return () => {
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
                            7, // Width when hovered
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
                            0.5, // Slightly transparent otherwise
                        ],
                    }}
                />
            </Source>
        </>
    );
};
