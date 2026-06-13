class MapboxApiService {
    private sampleCoordinates(coordinates: any[], sampleSize: number): any[] {
        if (coordinates.length <= sampleSize) return coordinates;

        const step = Math.floor(coordinates.length / sampleSize);
        const sampled: any[] = [];

        for (let i = 0; i < sampleSize; i++) {
            const index = Math.min(i * step, coordinates.length - 1);
            sampled.push(coordinates[index]);
        }

        return sampled;
    }

    public async reverse_geocoding(longitude: number, latitude: number) {
        try {
            const response = await fetch(
                `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
            );

            if (!response.ok) {
                throw new Error('Failed to fetch data from Mapbox API');
            }

            return response;
        } catch (error) {
            console.error('Mapbox Reverse Geocoding API Error: ', error);

            throw error;
        }
    }

    public async search(search: string) {
        try {
            const response = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?q=${search}&proximity=ip&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`);

            if (!response.ok) {
                throw new Error('Failed to fetch data from Mapbox Search API');
            }

            return response.json();
        } catch (error) {
            console.error('Mapbox Search API Error: ', error);
            throw error;
        }
    }

    public async getDirections(start: [number, number], destination: [number, number], damagedRoads: any, profile?: 'driving' | 'walking' | 'cycling') {
        try {
            // Filter damaged roads to only those within a reasonable distance of the route
            // Calculate bounding box around start and destination with buffer
            const bufferKm = 5; // 5km buffer around the route
            const bufferDegrees = bufferKm / 111; // Approximate conversion from km to degrees

            const minLng = Math.min(start[0], destination[0]) - bufferDegrees;
            const maxLng = Math.max(start[0], destination[0]) + bufferDegrees;
            const minLat = Math.min(start[1], destination[1]) - bufferDegrees;
            const maxLat = Math.max(start[1], destination[1]) + bufferDegrees;

            // Filter damaged roads that intersect with the bounding box
            const relevantDamagedRoads = damagedRoads.filter((road: any) => {
                const geometry = typeof road.geometry === 'string' ? JSON.parse(road.geometry) : road.geometry;
                const coordinates = geometry.coordinates;

                // Check if any coordinate of this road is within the bounding box
                return coordinates.some(([lon, lat]: [number, number]) =>
                    lon >= minLng && lon <= maxLng && lat >= minLat && lat <= maxLat
                );
            });

            console.log(`Total damaged roads: ${damagedRoads.length}, Relevant damaged roads: ${relevantDamagedRoads.length}`);

            // Extract coordinates from relevant damaged roads to use as exclusion points
            const exclusionCoordinates = relevantDamagedRoads
                .map((road: any) => {
                    const geometry = typeof road.geometry === 'string' ? JSON.parse(road.geometry) : road.geometry;
                    return geometry.coordinates;
                })
                .reduce((acc: any, val: any) => acc.concat(val), []);

            // Sample exclusion coordinates to stay within the 50 point limit
            const MAX_EXCLUSION_POINTS = 50;
            const sampledExclusions = exclusionCoordinates.length > MAX_EXCLUSION_POINTS
                ? this.sampleCoordinates(exclusionCoordinates, MAX_EXCLUSION_POINTS)
                : exclusionCoordinates;

            console.log(`Total exclusion coordinates: ${exclusionCoordinates.length}, Sampled: ${sampledExclusions.length}`);

            // Format exclusion points for Mapbox API: point(lon lat),point(lon lat),...
            const exclusionPoints = sampledExclusions.map(([lon, lat]: [number, number]) => `point(${lon}%20${lat})`).join(',');

            // Build the API URL with exclusion points
            const excludeParam = exclusionPoints ? `&exclude=${exclusionPoints}` : '';
            const apiUrl = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${start[0]},${start[1]};${destination[0]},${destination[1]}?alternatives=true&geometries=geojson${excludeParam}&language=en&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;

            console.log('API URL:', apiUrl.substring(0, 200) + (apiUrl.length > 200 ? '...' : ''));

            // Get routes from Mapbox with exclusion points
            const response = await fetch(apiUrl);

            if (!response.ok) {
                console.error('Failed to fetch directions from Mapbox Direction API');

                throw new Error('Failed to fetch directions from Mapbox API.');
            }

            const data = await response.json();

            if (data.code !== 'Ok') {
                console.error('Failed to fetch directions from Mapbox Direction API');

                throw new Error('Failed to fetch directions from Mapbox Direction API.');
            }

            console.log(`Total routes from Mapbox: ${data.routes.length}`);

            // Convert Mapbox routes to GeoJSON Feature format
            const geoJsonFeatures = data.routes.map((route: any) => ({
                type: 'Feature' as const,
                geometry: route.geometry,
                properties: {
                    distance: route.distance,
                    duration: route.duration,
                    weight: route.weight,
                    weight_name: route.weight_name,
                },
            }));

            console.log('Returning GeoJSON features:', geoJsonFeatures);
            return geoJsonFeatures;
        } catch (error) {
            console.error('Mapbox Directions API Error: ', error);

            throw error;
        }
    }
}

export const mapboxService = new MapboxApiService();
