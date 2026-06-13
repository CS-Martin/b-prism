import { useEffect, useRef } from 'react';
import { useMap } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import { Feature, LineString, GeoJsonProperties } from 'geojson';

interface Directions extends Feature<LineString, GeoJsonProperties> {
    duration?: number;
    distance?: number;
}

export const DirectionLayer = ({ directions }: { directions: Directions[] }) => {
    const { current: mapRef } = useMap();
    const popupRef = useRef<mapboxgl.Popup[]>([]);

    const formatDuration = (durationInSeconds: number): string => {
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        return hours > 0 ? `${hours}h ${minutes} min` : `${minutes} min`;
    };

    useEffect(() => {
        if (!mapRef) return;
        const map = mapRef.getMap();

        if (!directions || directions.length === 0) return;

        map.getStyle()?.layers?.forEach((layer) => {
            if (layer.id.startsWith('route-')) {
                if (map.getLayer(layer.id)) {
                    map.removeLayer(layer.id);
                }
            }
        });

        // Remove previous popups
        popupRef.current.forEach((popup) => popup.remove());
        popupRef.current = [];

        directions.forEach((route, index) => {
            if (!route.geometry) return;

            const routeCoords = route.geometry.coordinates;
            if (routeCoords.length < 2) return;

            const midIndex = Math.floor(routeCoords.length / 2);
            const midPoint = routeCoords[midIndex] as [number, number];

            const duration = route.duration ?? 0;
            const distance = route.distance ?? 0;

            const formattedTime = formatDuration(duration);
            const formattedDistance = `${(distance / 1000).toFixed(1)} km`;

            const routeGeoJSON: GeoJSON.FeatureCollection = {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: {},
                        geometry: route.geometry,
                    },
                ],
            };

            const routeId = `route-${index}`;

            // Check if the source already exists before adding a new one
            if (map.getSource(routeId)) {
                if (map.getLayer(`${routeId}-background`)) {
                    map.removeLayer(`${routeId}-background`);
                }
                if (map.getLayer(`${routeId}-animated`)) {
                    map.removeLayer(`${routeId}-animated`);
                }
                map.removeSource(routeId);
            }

            // Add new route source and layers
            map.addSource(routeId, {
                type: 'geojson',
                data: routeGeoJSON,
            });

            map.addLayer({
                id: `${routeId}-background`,
                type: 'line',
                source: routeId,
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: {
                    'line-color': index === 0 ? '#FFC300' : 'blue',
                    'line-width': index === 0 ? 10 : 6,
                    'line-opacity': index === 0 ? 0.4 : 0.6,
                },
            });

            map.addLayer({
                id: `${routeId}-animated`,
                type: 'line',
                source: routeId,
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: {
                    'line-color': index === 0 ? '#FFD700' : '#3b82f6',
                    'line-width': index === 0 ? 6 : 4,
                    'line-dasharray': index === 0 ? [0, 4, 3] : [2, 2],
                },
            });

            // Create popup
            const popup = new mapboxgl.Popup({ closeOnClick: false })
                .setLngLat(midPoint)
                .setHTML(
                    `<div style="text-align: center;">
                    <div style="display: flex; align-items: center; gap: 5px; font-size: 14px; color: black">
                        <span>🚗</span> <strong>${formattedTime}</strong>
                    </div>
                    <div style="font-size: 12px; color: gray;">${formattedDistance}</div>
                </div>`,
                )
                .addTo(map);

            popupRef.current.push(popup);
        });

        // Animate dashed line
        const dashArraySequence = [
            [0, 4, 3],
            [0.5, 4, 2.5],
            [1, 4, 2],
            [1.5, 4, 1.5],
            [2, 4, 1],
            [2.5, 4, 0.5],
            [3, 4, 0],
            [0, 0.5, 3, 3.5],
            [0, 1, 3, 3],
            [0, 1.5, 3, 2.5],
            [0, 2, 3, 2],
            [0, 2.5, 3, 1.5],
            [0, 3, 3, 1],
            [0, 3.5, 3, 0.5],
        ];

        let step = 0;
        function animateDashArray(timestamp: number) {
            if (!map.getLayer('route-0-animated')) return;

            const newStep = Math.floor((timestamp / 50) % dashArraySequence.length);
            if (newStep !== step) {
                map.setPaintProperty('route-0-animated', 'line-dasharray', dashArraySequence[newStep]);
                step = newStep;
            }

            requestAnimationFrame(animateDashArray);
        }

        animateDashArray(0);
    }, [directions, mapRef]);

    return null;
};
