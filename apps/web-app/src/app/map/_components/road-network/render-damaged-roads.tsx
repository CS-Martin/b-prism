import { Layer, Source, useMap } from 'react-map-gl';
import { useEffect, useRef, useState } from 'react';
import { RoadNetworkDto } from '@dto';
import { DestroyRoadModal } from './destroy-road-modal';
import { FixRoadModal } from './fix-road-modal';

interface RenderDamagedRoadsProps {
    damagedRoadsData: RoadNetworkDto[];
}

export const RenderDamagedRoads = ({ damagedRoadsData }: RenderDamagedRoadsProps) => {
    const { current: map } = useMap();
    const hoveredRoadId = useRef<string | null>(null);
    const [selectedRoadId, setSelectedRoadId] = useState<string | null>(null);

    const damagedRoadNetworkGeoformat =
        damagedRoadsData?.map((feature, index) => ({
            id: index,
            properties: {
                id: feature.id,
                is_damaged: feature.is_damaged,
                ...feature.properties,
            },
            geometry: feature.geometry,
        })) ?? [];

    useEffect(() => {
        if (!map) return;

        const handleMouseMove = (e: any) => {
            const features = map.queryRenderedFeatures(e.point, { layers: ['damaged_road_layer'] });

            if (features.length > 0) {
                const road = features[0];
                map.getCanvas().style.cursor = 'pointer';

                if (hoveredRoadId.current !== null) {
                    map.setFeatureState({ source: 'damaged-road-network-source', id: hoveredRoadId.current }, { hover: false });
                }

                if (road.id !== undefined) {
                    hoveredRoadId.current = road.id as string;
                    map.setFeatureState({ source: 'damaged-road-network-source', id: hoveredRoadId.current }, { hover: true });
                }
            }
        };

        const handleMouseLeave = () => {
            if (hoveredRoadId.current !== null) {
                map.getCanvas().style.cursor = 'grab';
                map.setFeatureState({ source: 'damaged-road-network-source', id: hoveredRoadId.current }, { hover: false });
            }
            hoveredRoadId.current = null;
        };

        const handleClick = (e: any) => {
            const features = map.queryRenderedFeatures(e.point, { layers: ['damaged_road_layer'] });
            if (features.length > 0) {
                const roadId = features[0].properties?.id;
                setSelectedRoadId(roadId);
            }
        };

        map.on('mousemove', 'damaged_road_layer', handleMouseMove);
        map.on('mouseleave', 'damaged_road_layer', handleMouseLeave);
        map.on('click', 'damaged_road_layer', handleClick);

        return () => {
            map.off('mousemove', 'damaged_road_layer', handleMouseMove);
            map.off('mouseleave', 'damaged_road_layer', handleMouseLeave);
            map.off('click', 'damaged_road_layer', handleClick);
        };
    }, [map]);

    return (
        <>
            <Source
                id='damaged-road-network-source'
                type='geojson'
                data={{ type: 'FeatureCollection', features: damagedRoadNetworkGeoformat }}>
                <Layer
                    id='damaged_road_layer'
                    type='line'
                    paint={{
                        'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 12, 5],
                        'line-color': 'red',
                        'line-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.6],
                    }}
                />
            </Source>

            {selectedRoadId && (
                <FixRoadModal
                    roadId={selectedRoadId}
                    setIsDialogOpen={() => setSelectedRoadId(null)}
                />
            )}
        </>
    );
};
