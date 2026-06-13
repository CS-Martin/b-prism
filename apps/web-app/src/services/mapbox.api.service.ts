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

            // Score damaged roads by proximity to the direct path between start and destination
            const scoredDamagedRoads = relevantDamagedRoads.map((road: any) => {
                const geometry = typeof road.geometry === 'string' ? JSON.parse(road.geometry) : road.geometry;
                const coordinates = geometry.coordinates;
                
                let minDistanceToPath = Infinity;
                
                // Calculate distance from each damaged road point to the direct path
                for (const coord of coordinates) {
                    const distanceToPath = this.pointToLineDistance(
                        coord[0], coord[1],
                        start[0], start[1],
                        destination[0], destination[1]
                    );
                    if (distanceToPath < minDistanceToPath) {
                        minDistanceToPath = distanceToPath;
                    }
                }
                
                return {
                    road,
                    coordinates,
                    minDistanceToPath,
                };
            });

            // Sort by proximity to the direct path (closest first)
            scoredDamagedRoads.sort((a: any, b: any) => a.minDistanceToPath - b.minDistanceToPath);

            // Select the top damaged roads closest to the path
            const MAX_EXCLUSION_POINTS = 50;
            let selectedCoordinates: any[] = [];
            let totalPoints = 0;

            for (const scoredRoad of scoredDamagedRoads) {
                if (totalPoints + scoredRoad.coordinates.length > MAX_EXCLUSION_POINTS) {
                    // Sample from this road to stay within limit
                    const remainingPoints = MAX_EXCLUSION_POINTS - totalPoints;
                    const sampled = this.sampleCoordinates(scoredRoad.coordinates, remainingPoints);
                    selectedCoordinates = selectedCoordinates.concat(sampled);
                    break;
                }
                selectedCoordinates = selectedCoordinates.concat(scoredRoad.coordinates);
                totalPoints += scoredRoad.coordinates.length;
            }

            console.log(`Selected ${selectedCoordinates.length} exclusion points from ${scoredDamagedRoads.length} damaged roads closest to path`);

            // Format exclusion points for Mapbox API: point(lon lat),point(lon lat),...
            const exclusionPoints = selectedCoordinates.map(([lon, lat]: [number, number]) => `point(${lon}%20${lat})`).join(',');

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

            // Score routes by how many damaged road segments they pass through
            const scoredRoutes = data.routes.map((route: any) => {
                const routeCoordinates = route.geometry.coordinates;
                let damageScore = 0;
                let minDistance = Infinity;
                
                // Check how many points on the route are near damaged roads
                for (const damagedRoad of relevantDamagedRoads) {
                    const geometry = typeof damagedRoad.geometry === 'string' ? JSON.parse(damagedRoad.geometry) : damagedRoad.geometry;
                    const damagedCoords = geometry.coordinates;

                    for (const routeCoord of routeCoordinates) {
                        for (const damagedCoord of damagedCoords) {
                            const distance = this.calculateDistance(routeCoord[0], routeCoord[1], damagedCoord[0], damagedCoord[1]);
                            if (distance < 0.05) {
                                damageScore++;
                                if (distance < minDistance) {
                                    minDistance = distance;
                                }
                            }
                        }
                    }
                }
                
                return {
                    route,
                    damageScore,
                    minDistance: minDistance === Infinity ? 0 : minDistance,
                };
            });

            // Sort by damage score (ascending), then by min distance (descending)
            scoredRoutes.sort((a: any, b: any) => {
                if (a.damageScore !== b.damageScore) {
                    return a.damageScore - b.damageScore;
                }
                return b.minDistance - a.minDistance;
            });

            console.log(`Route damage scores:`, scoredRoutes.map((r: any, i: number) => `Route ${i}: ${r.damageScore} points, min distance: ${r.minDistance.toFixed(4)}km`));

            // Return the route with the least damage
            const bestRoute = scoredRoutes[0].route;
            
            const geoJsonFeatures = [{
                type: 'Feature' as const,
                geometry: bestRoute.geometry,
                properties: {
                    distance: bestRoute.distance,
                    duration: bestRoute.duration,
                    weight: bestRoute.weight,
                    weight_name: bestRoute.weight_name,
                    damageScore: scoredRoutes[0].damageScore,
                },
            }];

            console.log('Returning GeoJSON features:', geoJsonFeatures);
            return geoJsonFeatures;
        } catch (error) {
            console.error('Mapbox Directions API Error: ', error);

            throw error;
        }
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

    private pointToLineDistance(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
        // Calculate distance from point (px, py) to line segment (x1, y1) to (x2, y2)
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;

        if (lenSq !== 0) {
            param = dot / lenSq;
        }

        let xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = px - xx;
        const dy = py - yy;

        // Convert to approximate km (assuming coordinates are in degrees)
        const distance = Math.sqrt(dx * dx + dy * dy) * 111; // Rough conversion to km
        return distance;
    }
}

export const mapboxService = new MapboxApiService();
