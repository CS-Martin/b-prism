import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Progress } from '@b-prism/shadcn-ui/index';
import { AlertTriangle, ArrowDown, ArrowUp, Home, Warehouse, Waypoints } from 'lucide-react';
import { Badge } from '@b-prism/shadcn-ui/index';
import { useRescuePostStore } from 'apps/web-app/src/stores/rescue-post-stores/rescue-post.store';
import { useEffect } from 'react';

interface StatisticCardsProps {
    timeRange: string | null;
}

export const StatisticCards = ({ timeRange }: StatisticCardsProps) => {
    // --- Stores ---
    const { rescuePosts, isLoading, error, fetchAllRescuePosts } = useRescuePostStore();

    // --- Handlers ---

    useEffect(() => {
        if (!rescuePosts || rescuePosts.length === 0) {
            fetchAllRescuePosts();
        }
    }, []);

    const totalAdults = rescuePosts.reduce((sum, post) => sum + (post.demographics?.total_adults || 0), 0);
    const totalChildren = rescuePosts.reduce((sum, post) => sum + (post.demographics?.total_children || 0), 0);
    const totalElderly = rescuePosts.reduce((sum, post) => sum + (post.demographics?.total_elderly || 0), 0);

    return (
        <>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0 '>
                        <CardTitle className='text-sm font-medium'>Active Rescue Requests</CardTitle>
                        <div className='p-1.5 rounded-md bg-red-200 '>
                            <AlertTriangle className='w-4 h-4 text-red-500' />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{rescuePosts.length}</div>
                        <div className='text-xs text-muted-foreground'>
                            <span className='inline-flex items-center text-red-500'>
                                <ArrowUp className='w-3 h-3 mr-1' />
                                +24%
                            </span>{' '}
                            from last {timeRange === '24h' ? 'day' : 'week'}
                        </div>
                        <div className='mt-3'>
                            <div className='flex items-center justify-between mb-1 text-xs'>
                                <span>Demographics</span>
                            </div>
                            <div className='grid grid-cols-3 gap-1'>
                                <div className='flex flex-col items-center'>
                                    <Badge
                                        variant='outline'
                                        className='justify-center w-full'>
                                        Adults
                                    </Badge>
                                    <span className='mt-1 text-xs'>{totalAdults}</span>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <Badge
                                        variant='outline'
                                        className='justify-center w-full'>
                                        Children
                                    </Badge>
                                    <span className='mt-1 text-xs'>{totalChildren}</span>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <Badge
                                        variant='outline'
                                        className='justify-center w-full'>
                                        Elderly
                                    </Badge>
                                    <span className='mt-1 text-xs'>{totalElderly}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                        <CardTitle className='text-sm font-medium'>Warehouse Resources</CardTitle>
                        <Warehouse className='w-4 h-4 text-yellow-500' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>68%</div>
                        <div className='text-xs text-muted-foreground'>
                            <span className='inline-flex items-center text-red-500'>
                                <ArrowDown className='w-3 h-3 mr-1' />
                                -14%
                            </span>{' '}
                            from last {timeRange === '24h' ? 'day' : 'week'}
                        </div>
                        <div className='mt-3'>
                            <div className='flex items-center justify-between mb-1 text-xs'>
                                <span>Critical Supplies</span>
                            </div>
                            <div className='grid grid-cols-2 gap-2 text-xs'>
                                <div className='flex justify-between'>
                                    <span>Food Packs</span>
                                    <span className='font-medium'>72%</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Standby Funds</span>
                                    <span className='font-medium text-red-500'>43%</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Non-Food Items</span>
                                    <span className='font-medium text-orange-500'>58%</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Capacity</span>
                                    <span className='font-medium'>84%</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                        <CardTitle className='text-sm font-medium'>Damaged Roads</CardTitle>
                        <Waypoints className='w-4 h-4 text-orange-500' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>42</div>
                        <div className='text-xs text-muted-foreground'>
                            <span className='inline-flex items-center text-red-500'>
                                <ArrowUp className='w-3 h-3 mr-1' />
                                +8
                            </span>{' '}
                            from last {timeRange === '24h' ? 'day' : 'week'}
                        </div>
                        <div className='mt-3'>
                            <div className='flex items-center justify-between mb-1 text-xs'>
                                <span>Damage Probability</span>
                            </div>
                            <div className='grid grid-cols-3 gap-1'>
                                <div className='flex flex-col items-center'>
                                    <Badge
                                        variant='destructive'
                                        className='justify-center w-full'>
                                        High
                                    </Badge>
                                    <span className='mt-1 text-xs'>18</span>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <Badge
                                        variant='default'
                                        className='justify-center w-full bg-orange-500'>
                                        Medium
                                    </Badge>
                                    <span className='mt-1 text-xs'>15</span>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <Badge
                                        variant='outline'
                                        className='justify-center w-full'>
                                        Low
                                    </Badge>
                                    <span className='mt-1 text-xs'>9</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                        <CardTitle className='text-sm font-medium'>Evacuation Centers</CardTitle>
                        <Home className='w-4 h-4 text-blue-500' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>16</div>
                        <div className='text-xs text-muted-foreground'>
                            <span className='inline-flex items-center text-green-500'>
                                <ArrowUp className='w-3 h-3 mr-1' />
                                +3
                            </span>{' '}
                            from last {timeRange === '24h' ? 'day' : 'week'}
                        </div>
                        <div className='mt-3'>
                            <div className='flex items-center justify-between mb-1 text-xs'>
                                <span>Capacity Utilization</span>
                                <span className='font-medium'>76%</span>
                            </div>
                            <Progress
                                value={76}
                                className='h-2'
                            />
                            <div className='mt-2 text-xs text-muted-foreground'>
                                <span>1,824 people currently sheltered</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};
