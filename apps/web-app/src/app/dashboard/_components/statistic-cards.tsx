import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Progress } from '@b-prism/shadcn-ui/index';
import { AlertTriangle, ArrowDown, ArrowUp, Home, Warehouse, Waypoints } from 'lucide-react';
import { Badge } from '@b-prism/shadcn-ui/index';
import { useRescuePostStore } from 'apps/web-app/src/stores/rescue-post-stores/rescue-post.store';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAnalyticalDashboardStore } from 'apps/web-app/src/stores/dashboard-stores/analytical-dashboard.store';

export const StatisticCards = () => {
    const selectedRange = useAnalyticalDashboardStore((state) => state.selectedRange);

    return (
        <>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <ActiveRequestCard selectedRange={selectedRange} />
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                        <CardTitle className='text-sm font-medium'>Warehouse Resources</CardTitle>
                        <div className='p-1.5 rounded-md bg-yellow-200'>
                            <Warehouse className='w-4 h-4 text-yellow-500' />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>68%</div>
                        <div className='text-xs text-muted-foreground'>
                            <span className='inline-flex items-center text-red-500'>
                                <ArrowDown className='w-3 h-3 mr-1' />
                                -14%
                            </span>{' '}
                            from last {selectedRange === '24h' ? 'day' : 'week'}
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
                        <div className='p-1.5 rounded-md bg-orange-200'>
                            <Waypoints className='w-4 h-4 text-orange-500' />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>42</div>
                        <div className='text-xs text-muted-foreground'>
                            <span className='inline-flex items-center text-red-500'>
                                <ArrowUp className='w-3 h-3 mr-1' />
                                +8
                            </span>{' '}
                            from last {selectedRange === '24h' ? 'day' : 'week'}
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
                        <div className='p-1.5 rounded-md bg-blue-200'>
                            <Home className='w-4 h-4 text-blue-500' />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>16</div>
                        <div className='text-xs text-muted-foreground'>
                            <span className='inline-flex items-center text-green-500'>
                                <ArrowUp className='w-3 h-3 mr-1' />
                                +3
                            </span>{' '}
                            from last {selectedRange === '24h' ? 'day' : 'week'}
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

const ActiveRequestCard = ({ selectedRange }: { selectedRange: string }) => {
    const { rescuePosts, isLoading, error, fetchAllRescuePosts } = useRescuePostStore();

    // --- State and Refs ---
    const previousFilteredCount = useRef<number | null>(null); // Ref to store the count from the *previous* render cycle
    const [percentageChange, setPercentageChange] = useState(0);

    // --- Initial Data Fetch ---
    useEffect(() => {
        // Fetch only if posts haven't been loaded yet.
        // Consider if you need to refetch periodically or based on other triggers.
        if (!rescuePosts || rescuePosts.length === 0) {
            fetchAllRescuePosts();
        }
    }, [fetchAllRescuePosts, rescuePosts]); // Added fetchAllRescuePosts to dependency array

    // --- Filtering Logic (Memoized for performance) ---
    // useMemo ensures filtering only happens when rescuePosts or selectedRange changes
    const filteredRescuePosts = useMemo(() => {
        console.log('Filtering posts for range:', selectedRange);
        if (!rescuePosts) return []; // Handle case where rescuePosts is null/undefined initially

        return rescuePosts.filter((post) => {
            // 1. Must be an active request
            if (post.isRescued) {
                return false;
            }

            // 2. Must fall within the selected date range
            try {
                const postDate = new Date(post.created_at);
                // Basic validation for date object
                if (isNaN(postDate.getTime())) {
                    console.warn(`Invalid date format for post ${post.id}: ${post.created_at}`);
                    return false; // Skip posts with invalid dates
                }
                const currentDate = new Date();

                // --- Date Comparison Logic ---
                // NOTE: This calculates based on *calendar days*.
                // If you need precise "last 24 hours", compare timeDiff directly.
                // Example for precise 24h: const hoursDiff = timeDiff / (1000 * 3600); return hoursDiff <= 24;
                const timeDiff = currentDate.getTime() - postDate.getTime();
                const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

                switch (selectedRange) {
                    case '24h':
                        // Includes posts created today (daysDiff=0) and yesterday (daysDiff=1)
                        return daysDiff <= 1;
                    case '7d':
                        // Includes posts created in the last 7 days (including today)
                        return daysDiff <= 7;
                    case '30d':
                        // Includes posts created in the last 30 days (including today)
                        return daysDiff <= 30;
                    case '90d':
                        // Includes posts created in the last 90 days (including today)
                        return daysDiff <= 90;
                    case 'all': // Assuming you might have an 'all time' option
                    default:
                        return true; // No date filtering
                }
            } catch (e) {
                console.error(`Error processing date for post ${post.id}:`, e);
                return false; // Exclude posts that cause errors during date processing
            }
        });
    }, [rescuePosts, selectedRange]); // Dependencies for filtering

    console.log('Filtered Rescue Posts:', filteredRescuePosts);
    const currentFilteredCount = filteredRescuePosts.length; // Get the count of *filtered* posts

    // --- Percentage Change Calculation ---
    useEffect(() => {
        console.log('Calculating Percentage Change. Current Count:', currentFilteredCount, 'Previous Count:', previousFilteredCount.current);

        // Don't calculate if the previous value isn't set yet (first render after mount or first valid calculation)
        if (previousFilteredCount.current === null) {
            console.log('Initializing previous count.');
            previousFilteredCount.current = currentFilteredCount; // Initialize the ref
            setPercentageChange(0); // Set initial change to 0
            return;
        }

        // Calculate percentage change compared to the PREVIOUS RENDER's filtered count
        const previousCount = previousFilteredCount.current;
        let change = 0;

        if (previousCount !== currentFilteredCount) {
            // Only calculate if there's an actual change
            if (previousCount === 0) {
                // If previous was 0, any increase is effectively infinite, often shown as +100% or just the new value.
                // Let's represent a move from 0 to N as a 100% increase if N > 0.
                change = currentFilteredCount > 0 ? 100 : 0;
            } else {
                change = ((currentFilteredCount - previousCount) / previousCount) * 100;
            }
            setPercentageChange(change);
        } else {
            // If the count hasn't changed, ensure percentage is 0 (handles potential floating point issues if not reset)
            if (percentageChange !== 0) {
                setPercentageChange(0);
            }
        }

        // IMPORTANT: Update the ref with the *current* count for the *next* comparison
        previousFilteredCount.current = currentFilteredCount;

        // Run this effect when the *result* of the filtering (the count) changes.
        // This correctly triggers recalculation when data updates OR the range changes.
    }, [currentFilteredCount]); // Dependency: only the count itself

    // --- Demographics Calculation (based on filtered posts) ---
    const { totalAdults, totalChildren, totalElderly } = useMemo(() => {
        return filteredRescuePosts.reduce(
            (acc, post) => {
                acc.totalAdults += post.demographics?.total_adults || 0;
                acc.totalChildren += post.demographics?.total_children || 0;
                acc.totalElderly += post.demographics?.total_elderly || 0;
                return acc;
            },
            { totalAdults: 0, totalChildren: 0, totalElderly: 0 },
        );
    }, [filteredRescuePosts]); // Dependency: only the filtered list

    console.log('Percentage Change State:', percentageChange);

    // --- Range Label Helper ---
    const getRangeLabel = (range: string) => {
        switch (range) {
            case '24h':
                return 'over the last day';
            case '7d':
                return 'over the last 7 days';
            case '30d':
                return 'over the last 30 days';
            case '90d':
                return 'over the last 90 days';
            default:
                return 'overall';
        }
    };

    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0 '>
                <CardTitle className='text-sm font-medium'>Active Rescue Requests</CardTitle>
                <div className='p-1.5 rounded-md bg-red-200 '>
                    <AlertTriangle className='w-4 h-4 text-red-500' />
                </div>
            </CardHeader>
            <CardContent>
                <div className='text-2xl font-bold'>{isLoading ? '...' : currentFilteredCount}</div>
                <div className='text-xs text-muted-foreground'>
                    {percentageChange > 0 ? (
                        <span className='inline-flex items-center text-red-500'>
                            <ArrowUp className='w-3 h-3 mr-1' />
                            {`+${percentageChange.toFixed(0)}%`}
                        </span>
                    ) : percentageChange < 0 ? (
                        <span className='inline-flex items-center text-green-500'>
                            <ArrowDown className='w-3 h-3 mr-1' />
                            {`${percentageChange.toFixed(0)}%`}
                        </span>
                    ) : (
                        previousFilteredCount.current !== null && <span>No changes</span>
                    )}

                    {previousFilteredCount.current !== null && ` ${getRangeLabel(selectedRange)}`}
                </div>

                <div className='mt-3'>
                    <div className='flex items-center justify-between mb-1 text-xs'>
                        <span>Demographics in Filter</span>
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
    );
};

export default StatisticCards;
