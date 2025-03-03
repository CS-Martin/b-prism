'use client';

import { RoadNetworkDto } from '@dto';
import { useGetDirections } from 'apps/web-app/src/hooks/map.hook';
import { useEffect, useState } from 'react';
import { useMap } from 'react-map-gl';
import { DirectionLayer } from './direction-layer';
import { PromptGuide } from './prompt-guide';
import { DirectionPanel } from './direction-stats-panel';

interface GenerateDirectionsProps {
    damagedRoads: RoadNetworkDto[];
}

export const GenerateDirections = ({ damagedRoads }: GenerateDirectionsProps) => {
    const { current: map } = useMap();
    const { directions, getDirections, isLoading } = useGetDirections();

    const [start, setStart] = useState<[number, number] | null>(null);
    const [destination, setDestination] = useState<[number, number] | null>(null);

    useEffect(() => {
        if (!map) return;

        const handleClick = (e: mapboxgl.MapMouseEvent) => {
            const feature = map.queryRenderedFeatures(e.point, { layers: ['warehouse_layer', 'dispensing_point_layer'] });

            if (!feature || feature.length === 0) return;

            const id = feature[0]?.layer?.id;
            const [lng, lat] = (feature[0].geometry as GeoJSON.Point).coordinates;

            // Should only be dp and warehouse layer
            if (id !== 'warehouse_layer' && id !== 'dispensing_point_layer') return;

            if (id === 'warehouse_layer') {
                setStart([lng, lat]);
            } else if (id === 'dispensing_point_layer') {
                setDestination([lng, lat]);
            }
        };

        map.on('click', handleClick);

        return () => {
            map.off('click', handleClick);
        };
    }, [map]);

    useEffect(() => {
        if (start && destination) {
            getDirections(start, destination, damagedRoads, 'driving')
                .then(() => console.log('Directions:', directions))
                .catch((err) => console.error('Error fetching directions:', err));
        }
    }, [start, destination, getDirections]);

    // Store coordinates of clicked warehouse as starting point
    // Store coordinates of cliced dispensing point as destination
    return (
        // Center div that prompts user to click a warehouse as starting point
        <div
            className='absolute z-50 w-full h-full'
            style={{ pointerEvents: 'none' }}>
            {directions && <DirectionLayer directions={directions} />}
            <PromptGuide
                start={start}
                destination={destination}
            />
            <DirectionPanel
                start={start}
                destination={destination}
            />
        </div>
    );
};
