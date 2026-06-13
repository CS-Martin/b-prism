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

            // Get multiple route alternatives from Mapbox
            const response = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/${profile}/${start[0]},${start[1]};${destination[0]},${destination[1]}?alternatives=true&geometries=geojson&language=en&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
            );

            if (!response.ok) {
                console.error('Failed to fetch directions from Mapbox Direction API');

                throw new Error('Failed to fetch directions from Mapbox API.');
            }

            const data = await response.json();

            if (data.code !== 'Ok') {
                console.error('Failed to fetch directions from Mapbox Direction API');

                throw new Error('Failed to fetch directions from Mapbox Direction API.');
            }

            // Filter routes that pass through damaged roads
            const safeRoutes = data.routes.filter((route: any) => {
                const routeCoordinates = route.geometry.coordinates;
                let nearDamagedRoad = false;
                
                // Check if any point on the route is near a damaged road
                for (const damagedRoad of relevantDamagedRoads) {
                    const geometry = typeof damagedRoad.geometry === 'string' ? JSON.parse(damagedRoad.geometry) : damagedRoad.geometry;
                    const damagedCoords = geometry.coordinates;

                    // Check if route intersects with this damaged road
                    for (const routeCoord of routeCoordinates) {
                        for (const damagedCoord of damagedCoords) {
                            const distance = this.calculateDistance(routeCoord[0], routeCoord[1], damagedCoord[0], damagedCoord[1]);
                            // If within 50 meters of a damaged road, consider this route unsafe
                            if (distance < 0.05) {
                                nearDamagedRoad = true;
                                console.log(`Route point near damaged road: distance=${distance.toFixed(4)}km`);
                                break;
                            }
                        }
                        if (nearDamagedRoad) break;
                    }
                    if (nearDamagedRoad) break;
                }
                
                return !nearDamagedRoad;
            });

            console.log(`Total routes from Mapbox: ${data.routes.length}, Safe routes: ${safeRoutes.length}`);

            // If no safe routes, try to create a route with waypoints around damaged areas
            if (safeRoutes.length === 0) {
                console.warn('No safe routes found, attempting waypoint routing');
                
                // Try to find a waypoint that avoids damaged roads
                const waypointRoute = await this.tryWaypointRouting(start, destination, relevantDamagedRoads, profile || 'driving');
                if (waypointRoute) {
                    return [waypointRoute];
                }
            }

            // Convert Mapbox routes to GeoJSON Feature format
            const routesToReturn = safeRoutes.length > 0 ? safeRoutes : data.routes;
            
            const geoJsonFeatures = routesToReturn.map((route: any) => ({
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

    private async tryWaypointRouting(start: [number, number], destination: [number, number], damagedRoads: any, profile: string): Promise<any> {
        // Calculate midpoint offset by perpendicular direction
        const midLng = (start[0] + destination[0]) / 2;
        const midLat = (start[1] + destination[1]) / 2;
        
        // Calculate perpendicular direction
        const dx = destination[0] - start[0];
        const dy = destination[1] - start[1];
        const perpLng = -dy * 0.01; // Small offset
        const perpLat = dx * 0.01;
        
        // Try waypoints in both perpendicular directions
        const waypoints = [
            [midLng + perpLng, midLat + perpLat],
            [midLng - perpLng, midLat - perpLat],
        ];

        for (const waypoint of waypoints) {
            try {
                const response = await fetch(
                    `https://api.mapbox.com/directions/v5/mapbox/${profile}/${start[0]},${start[1]};${waypoint[0]},${waypoint[1]};${destination[0]},${destination[1]}?geometries=geojson&language=en&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
                );

                if (response.ok) {
                    const data = await response.json();
                    if (data.code === 'Ok' && data.routes.length > 0) {
                        console.log('Found waypoint route');
                        return {
                            type: 'Feature' as const,
                            geometry: data.routes[0].geometry,
                            properties: {
                                distance: data.routes[0].distance,
                                duration: data.routes[0].duration,
                                weight: data.routes[0].weight,
                                weight_name: data.routes[0].weight_name,
                            },
                        };
                    }
                }
            } catch (error) {
                console.warn('Waypoint routing failed:', error);
            }
        }

        return null;
    }

    private calculateDistance(lon1: number, lat1: number, lon2: number, lat2: number): number {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}

export const mapboxService = new MapboxApiService();
