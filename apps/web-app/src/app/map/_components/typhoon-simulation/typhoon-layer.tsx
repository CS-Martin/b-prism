import { useEffect } from 'react';
import { useMap } from 'react-map-gl';
import { FeatureCollection } from 'geojson';

export const TyphoonLayer = () => {
    const { current: mapRef } = useMap();

    useEffect(() => {
        if (!mapRef) return;
        const map = mapRef.getMap();

        const loadImage = async () => {
            try {
                const response = await fetch('/img/cyclone-img.png');

                if (!response.ok) {
                    console.error('Failed to load cyclone image');
                    throw new Error('Failed to load cyclone image');
                }

                const blob = await response.blob();
                const image = await createImageBitmap(blob);

                if (!map.hasImage('cyclone-icon')) {
                    map.addImage('cyclone-icon', image);
                    console.log('Cyclone icon added to map');
                }
            } catch (error) {
                console.error('Error loading cyclone icon:', error);
            }
        };

        // Simulated Typhoon Path (Longitude, Latitude)
        const typhoonPath: [number, number][] = [
            [124.588, 14.076],
            [124.5, 13.9],
            [124.3, 13.7],
            [124.0, 13.5],
            [123.8, 13.3],
            [123.5, 13.0],
            [123.2, 12.8],
        ];

        const typhoonLine: FeatureCollection = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: { type: 'LineString', coordinates: typhoonPath },
                    properties: {},
                },
            ],
        };

        // Define GeoJSON outside of .then() for cleanup access
        const typhoonCircles: FeatureCollection = {
            type: 'FeatureCollection',
            features: typhoonPath.flatMap((coordinates, index) => [
                {
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates },
                    properties: {
                        type: 'inner', // Cyclone icon
                    },
                },
                {
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates },
                    properties: {
                        size: 100000 + index * 50000,
                        color: `rgba(255, ${50 + index * 20}, ${50 + index * 20}, 0.${9 - index * 1})`,
                        type: 'outer',
                    },
                },
            ]),
        };

        loadImage().then(() => {
            if (!map.getSource('typhoon-circles')) {
                map.addSource('typhoon-circles', { type: 'geojson', data: typhoonCircles });
                map.addSource('typhoon-line', { type: 'geojson', data: typhoonLine });

                // Inner Circle as Cyclone Icon

                // Outer Expanding Circles
                typhoonCircles.features.forEach((feature, index) => {
                    if (feature.properties!.type === 'outer') {
                        map.addLayer({
                            id: `typhoon-circle-${index}`,
                            type: 'circle',
                            source: 'typhoon-circles',
                            filter: ['==', ['get', 'size'], feature.properties!.size],
                            paint: {
                                'circle-radius': ['/', ['get', 'size'], 2000],
                                'circle-color': ['get', 'color'],
                                'circle-stroke-width': 2,
                                'circle-stroke-color': 'rgba(255, 50, 50, 0.5)',
                            },
                        });
                    }
                });
                map.addLayer({
                    id: 'typhoon-path',
                    type: 'line',
                    source: 'typhoon-line',
                    paint: {
                        'line-color': 'white', // Red with 70% opacity
                        'line-width': 3,
                        'line-dasharray': [2, 2], // Optional: Dashed effect
                    },
                });
                map.addLayer({
                    id: 'typhoon-icon-layer',
                    type: 'symbol',
                    source: 'typhoon-circles',
                    filter: ['==', ['get', 'type'], 'inner'],
                    layout: {
                        'icon-image': 'cyclone-icon',
                        'icon-size': 1, // Adjust size as needed
                        'icon-allow-overlap': true,
                    },
                });
            }
        });

        return () => {
            if (map.getLayer('typhoon-icon-layer')) map.removeLayer('typhoon-icon-layer');
            typhoonCircles.features.forEach((feature, index) => {
                if (map.getLayer(`typhoon-circle-${index}`)) map.removeLayer(`typhoon-circle-${index}`);
            });
            if (map.getSource('typhoon-circles')) map.removeSource('typhoon-circles');
        };
    }, [mapRef]);

    return null;
};
