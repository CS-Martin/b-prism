class MapboxApiService {
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
            // Extract coordinates from damaged roads and format them for the Mapbox API
            const coordinates = damagedRoads
                .map((road: any) => {
                    // Parse the geometry if it's a string, otherwise use it directly
                    const geometry = typeof road.geometry === 'string' ? JSON.parse(road.geometry) : road.geometry;
                    // Return the coordinates from the geometry
                    return geometry.coordinates;
                })
                // Flatten the array of coordinates
                .reduce((acc: any, val: any) => acc.concat(val), []);

            // Format coordinates for Mapbox API by converting them to 'point(lon lat)' format
            const excludedPoints = coordinates.map(([lon, lat]: [number, number]) => `point(${lon} ${lat})`).join(',');

            // Create the exclude parameter for the Mapbox API request
            const excludeParam = excludedPoints ? `&exclude=${excludedPoints}` : '';

            const response = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/${profile}/${start[0]},${start[1]};${destination[0]},${destination[1]}?alternatives=true&geometries=geojson${excludeParam}&language=en&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
            );

            if (response.status === 422) {
                console.error('All routes to the destination are damaged. Cannot proceed.');

                throw new Error('All routes to the destination are damaged. Cannot proceed.');
            }

            if (!response.ok) {
                console.error('Failed to fetch directions from Mapbox Direction API  ');

                throw new Error('Failed to fetch directions from Mapbox API.');
            }

            const data = await response.json();

            if (data.code !== 'Ok') {
                console.error('Failed to fetch directions from Mapbox Direction API  ');

                throw new Error('Failed to fetch directions from Mapbox Direction API.');
            }

            return data.routes;
        } catch (error) {
            console.error('Mapbox Directions API Error: ', error);

            throw error;
        }
    }
}

export const mapboxService = new MapboxApiService();
