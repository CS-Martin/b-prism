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
import { Activity, MapPin } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { parseISO, format } from 'date-fns';

const chartConfig = {
    activeRequest: {
        label: 'Desktop',
        color: '#2563eb',
    },
    rescued: {
        label: 'Mobile',
        color: '#60a5fa',
    },
} satisfies ChartConfig;

export const Overview = () => {
    const { rescuePosts, isLoading, error, fetchAllRescuePosts } = useRescuePostStore();

    useEffect(() => {
        if (!rescuePosts) {
            fetchAllRescuePosts();
        }
    }, []);

    const chartData = useMemo(() => {
        const monthCounts: Record<string, { activeRequest: number; rescued: number }> = {};

        rescuePosts.forEach((post) => {
            const month = format(post.created_at, 'MMMM');
            if (!monthCounts[month]) {
                monthCounts[month] = { activeRequest: 0, rescued: 0 };
            }

            if (post.isRescued) {
                monthCounts[month].rescued += 1;
            } else {
                monthCounts[month].activeRequest += 1;
            }
        });

        return Object.keys(monthCounts).map((month) => ({
            month,
            activeRequests: monthCounts[month].activeRequest,
            rescued: monthCounts[month].rescued,
        }));
    }, [rescuePosts]);

    return (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
            <Card className='lg:col-span-4'>
                <CardHeader>
                    <CardTitle>Rescue Request Heatmap</CardTitle>
                    <CardDescription>Concentration of people in need of rescue in the Bicol Region</CardDescription>
                </CardHeader>
                <CardContent className='pl-2'>
                    <div className='h-[300px] rounded-md border bg-muted flex items-center justify-center'>
                        <div className='text-center'>
                            <MapPin className='w-12 h-12 mx-auto mb-2 text-muted-foreground' />
                            <p className='text-sm text-muted-foreground'>Heatmap showing concentration of rescue requests</p>
                            <p className='mt-1 text-xs text-muted-foreground'>(Mapbox heatmap visualization would be integrated here)</p>
                            <p className='mt-1 text-xs text-muted-foreground'>Using RescuePost latitude/longitude data</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className='lg:col-span-3'>
                <CardHeader>
                    <CardTitle>Rescue Request Trends</CardTitle>
                    <CardDescription>Number of rescue requests over time</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* <div className='text-center'>
                            <Activity className='w-12 h-12 mx-auto mb-2 text-muted-foreground' />
                            <p className='text-sm text-muted-foreground'>Line chart showing rescue request trends</p>
                            <p className='mt-1 text-xs text-muted-foreground'>(Chart visualization would be integrated here)</p>
                        </div> */}
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
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />

                            <Bar
                                dataKey='activeRequests'
                                fill={chartConfig.activeRequest.color}
                            />
                            <Bar
                                dataKey='rescued'
                                fill={chartConfig.rescued.color}
                            />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
};
