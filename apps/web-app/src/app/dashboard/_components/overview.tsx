import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@b-prism/shadcn-ui/index';
import { useRescuePostStore } from 'apps/web-app/src/stores/rescue-post-stores/rescue-post.store';
import { useEffect, useMemo, useRef } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { format } from 'date-fns';
import { useProgress } from '@bprogress/next';
import { RescuePostDto } from '@dto';
import { GeoJSONSource } from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const chartConfig = {
    activeRequests: {
        label: 'Active Requests',
        color: '#2563eb',
    },
    rescued: {
        label: 'Rescued',
        color: '#4ade80',
    },
    pending: {
        label: 'Pending',
        color: '#60a5fa',
    },
} satisfies ChartConfig;

export const Overview = () => {
    const { start: startLoading, stop: stopLoading } = useProgress();
    const { rescuePosts, isLoading, fetchAllRescuePosts } = useRescuePostStore();

    useEffect(() => {
        if (!rescuePosts) {
            fetchAllRescuePosts();
        }
    }, []);

    useEffect(() => {
        if (isLoading) {
            startLoading();
        } else {
            stopLoading();
        }
    }, [isLoading]);

    const chartData = useMemo(() => {
        const monthCounts: Record<string, { activeRequests: number; rescued: number; pending: number }> = {};

        rescuePosts.forEach((post) => {
            const month = format(post.created_at, 'yyyy-MM');

            if (!monthCounts[month]) {
                monthCounts[month] = { activeRequests: 0, rescued: 0, pending: 0 };
            }

            if (post.status === 2) {
                monthCounts[month].rescued += 1;
            } else if (post.status === 1) {
                monthCounts[month].pending += 1;
            } else if (post.status === 0) {
                monthCounts[month].activeRequests += 1;
            }
        });

        return Object.keys(monthCounts)
            .sort()
            .map((monthKey) => ({
                month: format(new Date(`${monthKey}-01`), 'MMM'),
                activeRequests: monthCounts[monthKey].activeRequests,
                rescued: monthCounts[monthKey].rescued,
                pending: monthCounts[monthKey].pending,
            }));
    }, [rescuePosts]);

    return (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
            <Card className='lg:col-span-4 bg-sidebar'>
                <CardHeader>
                    <CardTitle>Rescue Request Heatmap</CardTitle>
                    <CardDescription>Concentration of people in need of rescue in the Bicol Region</CardDescription>
                </CardHeader>
                <CardContent className=''>
                    <div className='h-[300px] rounded-md border bg-muted flex items-center justify-center'>
                        <RescueRequestHeatmap rescuePosts={rescuePosts ?? []} />
                    </div>
                </CardContent>
            </Card>

            <Card className='lg:col-span-3 bg-sidebar'>
                <CardHeader>
                    <CardTitle>Rescue Request Trends</CardTitle>
                    <CardDescription>Number of rescue requests over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        config={chartConfig}
                        className='min-h-[200px] w-full'>
                        <BarChart
                            accessibilityLayer
                            data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey='month'
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />

                            <Bar
                                dataKey='activeRequests'
                                fill={chartConfig.activeRequests.color}
                                radius={4}
                            />
                            <Bar
                                dataKey='pending'
                                fill={chartConfig.pending.color}
                                radius={4}
                            />
                            <Bar
                                dataKey='rescued'
                                fill={chartConfig.rescued.color}
                                radius={4}
                            />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export const RescueRequestHeatmap = ({ rescuePosts }: { rescuePosts: RescuePostDto[] }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
            console.error('Heatmap: Mapbox token is not configured!');
            return;
        }

        if (mapRef.current || !mapContainerRef.current) {
            return;
        }

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
            style: process.env.NEXT_PUBLIC_MAPBOX_STYLE || 'mapbox://styles/mapbox/streets-v11',
            center: [123.700163, 13.422066],
            zoom: 6.5,
            interactive: true,
        });

        const map = mapRef.current;

        // // Basic load handling for THIS map instance
        // map.on('load', () => {
        //     console.log('Heatmap: Local map instance loaded.');
        // });

        // Cleanup function: Remove map when component unmounts
        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    useEffect(() => {
        const map = mapRef.current;

        if (!map || !map.isStyleLoaded()) {
            console.debug('Heatmap (Local): Map instance not ready or style not loaded yet.');

            const waitForLoad = () => {
                if (map && map.isStyleLoaded()) {
                    console.debug('Heatmap (Local): Map loaded, attempting data update.');
                    updateHeatmapData(map, rescuePosts); // Call data update function
                    map.off('load', waitForLoad); // Clean up listener
                }
            };
            if (map && !map.isStyleLoaded()) {
                map.on('load', waitForLoad);
            } else if (map) {
                // If map exists and is loaded, proceed directly
                updateHeatmapData(map, rescuePosts);
            }

            return; // Initial return if map wasn't ready immediately
        }

        console.debug('Heatmap (Local): Map ready, updating heatmap data...');
        const cleanup = updateHeatmapData(map, rescuePosts);

        return cleanup;
    }, [rescuePosts]);

    const updateHeatmapData = (map: mapboxgl.Map, posts: RescuePostDto[]): (() => void) => {
        const geojsonData: GeoJSON.FeatureCollection<GeoJSON.Point> = {
            type: 'FeatureCollection',
            features: posts
                .filter((post) => post.location?.longitude != null && post.location?.latitude != null)
                .map((post) => ({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [post.location.longitude!, post.location.latitude!],
                    },
                    properties: {
                        intensity: post.number_of_people_affected > 0 ? post.number_of_people_affected : 1,
                    },
                })),
        };

        const sourceId = 'rescue-posts-heatmap-source-local';
        const layerId = 'rescue-heatmap-layer-local';

        // --- Add/Update Source and Layer ---
        const source = map.getSource(sourceId) as GeoJSONSource | undefined;

        if (source) {
            console.log('Heatmap (Local): Updating existing source data.');
            source.setData(geojsonData);
        } else {
            if (geojsonData.features.length > 0) {
                console.log('Heatmap (Local): Adding new source and layer.');
                try {
                    map.addSource(sourceId, {
                        type: 'geojson',
                        data: geojsonData,
                    });

                    map.addLayer({
                        id: layerId,
                        type: 'heatmap',
                        source: sourceId,
                        maxzoom: 18,
                        paint: {},
                    });
                } catch (e) {
                    console.error('Heatmap (Local): Error adding source/layer:', e);
                    if (map.getSource(sourceId)) map.removeSource(sourceId); // Cleanup failed attempt
                }
            } else {
                console.log('Heatmap (Local): No features, ensuring layer/source are removed.');
                // Explicitly remove if data becomes empty after being added
                if (map.getLayer(layerId)) map.removeLayer(layerId);
                if (map.getSource(sourceId)) map.removeSource(sourceId);
            }
        }

        // Return cleanup function specific to this data update
        return () => {
            // Check map validity before cleanup
            if (map && map.getStyle()) {
                console.log('Heatmap (Local): Cleaning up heatmap layer and source from data effect.');
                try {
                    if (map.getLayer(layerId)) map.removeLayer(layerId);
                    if (map.getSource(sourceId)) map.removeSource(sourceId);
                } catch (e) {
                    console.warn('Heatmap (Local): Error during layer/source cleanup:', e);
                }
            }
        };
    };

    return (
        <div
            ref={mapContainerRef}
            style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
        />
    );
};

export default Overview;
