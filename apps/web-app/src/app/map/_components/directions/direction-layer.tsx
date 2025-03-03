import { useEffect } from 'react';
import { useMap } from 'react-map-gl';

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
