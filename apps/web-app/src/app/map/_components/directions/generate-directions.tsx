'use client';

import { Input } from '@b-prism/shadcn-ui/index';
import { RoadNetworkDto } from '@dto';
import { useGetDirections } from 'apps/web-app/src/hooks/map.hook';
import { mapboxService } from 'apps/web-app/src/services/mapbox.api.service';
import { useEffect, useState } from 'react';
import { useMap } from 'react-map-gl';

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

export const DirectionLayer = ({ directions }: { directions: GeoJSON.Feature<GeoJSON.LineString> }) => {
    const { current: mapRef } = useMap();

    useEffect(() => {
        if (!mapRef) return;

        const map = mapRef.getMap();

        if (!directions?.geometry) return;

        const routeGeoJSON: GeoJSON.FeatureCollection = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    properties: {},
                    geometry: directions.geometry,
                },
            ],
        };

        if (map.getSource('route')) {
            (map.getSource('route') as mapboxgl.GeoJSONSource).setData(routeGeoJSON);
        } else {
            map.addSource('route', {
                type: 'geojson',
                data: routeGeoJSON,
            });

            map.addLayer({
                id: 'route-line',
                type: 'line',
                source: 'route',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: {
                    'line-color': '#007AFF',
                    'line-width': 5,
                    'line-opacity': 0.75,
                },
            });
        }
    }, [directions, mapRef]);

    return null; // No UI elements, just modifies the map
};

const PromptGuide = ({ start, destination }: { start: [number, number] | null; destination: [number, number] | null }) => {
    let message = '';

    if (!start) {
        message = 'Select a Warehouse as a Starting Point';
    } else if (!destination) {
        message = 'Select a Dispensing Point as Destination';
    }

    if (!message) return null; // Hide if both are selected

    return (
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/40 shadow-md px-4 py-2 rounded-md text-center text-white font-semibold text-lg'>
            {message}
        </div>
    );
};

const DirectionPanel = ({ start, destination }: { start: [number, number] | null; destination: [number, number] | null }) => {
    const formatCoord = (coord: number) => coord.toFixed(6);

    return (
        <div className='p-4 bg-white shadow-lg rounded-lg max-w-[20rem]'>
            <div className='mb-2'>
                <label className='block text-sm font-medium'>Start Coordinates</label>
                <Input
                    type='text'
                    value={start ? `${formatCoord(start[0])}, ${formatCoord(start[1])}` : ''}
                    readOnly
                />
            </div>
            <div>
                <label className='block text-sm font-medium'>Destination Coordinates</label>
                <Input
                    type='text'
                    value={destination ? `${formatCoord(destination[0])}, ${formatCoord(destination[1])}` : ''}
                    readOnly
                />
            </div>
        </div>
    );
};
