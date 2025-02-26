import { Layer, Source, useMap } from 'react-map-gl';
import { useEffect, useState, useRef } from 'react';
import { DestroyRoad } from './destroy-road';
import { FixRoad } from './fix-road';
import { useSession } from 'next-auth/react';
import { RoadNetworkDto } from '@dto';

interface RenderRoadNetworkProps {
    fixedRoadNetworkData: RoadNetworkDto[];
    fetchFixedRoadsByBounds: () => void;

    damagedRoadsData: RoadNetworkDto[];
    fetchDamagedRoads: () => void;

    isMapLoaded: boolean;
    visibility: { roadNetwork: boolean };
}

export const RenderRoadNetwork = ({ fixedRoadNetworkData, damagedRoadsData, isMapLoaded, visibility, fetchFixedRoadsByBounds, fetchDamagedRoads }: RenderRoadNetworkProps) => {
    const { data: session } = useSession();
    const { current: map } = useMap();

    const [selectedRoadId, setSelectedRoadId] = useState<string | null>(null);
    const [isDamaged, setIsDamaged] = useState<boolean | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const hoveredRoadId = useRef<string | null>(null);
    console.log(isDialogOpen);

    const fixedRoadNetworkGeoformat =
        fixedRoadNetworkData?.map((feature: RoadNetworkDto, index: number) => ({
            id: index,
            properties: {
                id: feature.id,
                is_damaged: feature.is_damaged,
                damage_probability: feature.damage_probability,
                ...feature.properties,
            },
            geometry: feature.geometry,
        })) ?? [];

    const damagedRoadNetworkGeoformat =
        damagedRoadsData?.map((feature: RoadNetworkDto, index: number) => ({
            id: index + fixedRoadNetworkData.length, // Avoid duplicate IDs
            properties: {
                id: feature.id,
                is_damaged: feature.is_damaged,
                damage_probability: feature.damage_probability,
                ...feature.properties,
            },
            geometry: feature.geometry,
        })) ?? [];

    // Encountered an issue where I cannot update the UI of fixed road
    // Had to implement this to manually alter the property of the road inside the fixedRoadGeojson
    // No need to worry because it is also updated in the database
    const UpdateFixedRoad = (roadId: string) => {
        // Finds the road
        const roadIndex = fixedRoadNetworkGeoformat.findIndex((road) => road.properties.id === roadId);

        // Change the propert.is_damage to tag it as passable
        if (roadIndex !== -1) {
            fixedRoadNetworkGeoformat[roadIndex].properties.is_damaged = false;
        }

        // Re-fetch to update UI
        fetchDamagedRoads();
    };

    useEffect(() => {
        if (!map || !isMapLoaded) return;

        const handleLayerClick = (e: any) => {
            const road = map.queryRenderedFeatures(e.point, { layers: ['road_layer'] });

            if (!road || road.length === 0) return;

            const clickedRoad = road[0];
            const clickedRoadId = clickedRoad.properties?.id;

            console.log(clickedRoad);

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
    }, [map, isMapLoaded, selectedRoadId]);

    if (!isMapLoaded) return null;

    return (
        <>
            <Source
                id='road-network-source'
                type='geojson'
                data={{
                    type: 'FeatureCollection',
                    features: [...fixedRoadNetworkGeoformat, ...damagedRoadNetworkGeoformat],
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
                    <FixRoad
                        setIsDialogOpen={setIsDialogOpen}
                        roadId={selectedRoadId}
                        fetchFixRoadByBounds={fetchFixedRoadsByBounds}
                        UpdateFixedRoad={UpdateFixedRoad}
                    />
                ) : (
                    <DestroyRoad
                        setIsDialogOpen={setIsDialogOpen}
                        roadId={selectedRoadId}
                        fetchDamagedRoads={fetchDamagedRoads}
                    />
                ))}
        </>
    );
};
