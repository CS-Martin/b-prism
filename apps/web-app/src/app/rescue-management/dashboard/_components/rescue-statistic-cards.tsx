import { Card, CardContent, CardHeader, CardTitle } from '@b-prism/shadcn-ui/index';
import { useProgress } from '@bprogress/next';
import { AnimatedCounter } from 'apps/web-app/src/components/animated-counter';
import { useRescuePostStore } from 'apps/web-app/src/stores/rescue-post-stores/rescue-post.store';
import { AlertTriangle, CheckCircle2, Users } from 'lucide-react';
import { useEffect } from 'react';

export const RescueStatisticCards = () => {
    const { start, stop } = useProgress();
    const { rescuePosts, isLoading, fetchAllRescuePosts } = useRescuePostStore();

    useEffect(() => {
        if (isLoading) {
            start();
        } else {
            stop();
        }
    }, [isLoading, start, stop]);

    useEffect(() => {
        if (!rescuePosts || rescuePosts.length === 0) {
            fetchAllRescuePosts();
        }

        const interval = setInterval(() => {
            fetchAllRescuePosts();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const totalPosts = rescuePosts.length;
    const pendingRescues = rescuePosts.filter((post) => !post.isRescued).length;
    const rescued = rescuePosts.filter((post) => post.isRescued).length;
    const peopleAffected = rescuePosts.reduce((sum, post) => sum + Number(post.number_of_people_affected), 0);

    return (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                    <CardTitle className='text-sm font-medium'>Total Rescue Posts</CardTitle>
                    <AlertTriangle className='w-4 h-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>
                        <AnimatedCounter value={totalPosts} />
                    </div>
                    <div className='text-xs text-muted-foreground'>Total rescue requests in the system</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                    <CardTitle className='text-sm font-medium'>Pending Rescues</CardTitle>
                    <AlertTriangle className='w-4 h-4 text-red-500' />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>
                        <AnimatedCounter value={pendingRescues} />
                    </div>
                    <div className='text-xs text-muted-foreground'>People waiting to be rescued</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                    <CardTitle className='text-sm font-medium'>Rescued</CardTitle>
                    <CheckCircle2 className='w-4 h-4 text-green-500' />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>
                        <AnimatedCounter value={rescued} />
                    </div>
                    <div className='text-xs text-muted-foreground'>Successfully rescued</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                    <CardTitle className='text-sm font-medium'>People Affected</CardTitle>
                    <Users className='w-4 h-4 text-blue-500' />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>
                        <AnimatedCounter value={peopleAffected} />
                    </div>
                    <div className='text-xs text-muted-foreground'>Total individuals needing assistance</div>
                </CardContent>
            </Card>
        </div>
    );
};
