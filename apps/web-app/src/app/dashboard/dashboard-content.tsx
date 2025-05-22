'use client';

import { AlertTriangle, Clock, LifeBuoy, Package, Truck, Users, Warehouse, Waypoints } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@b-prism/shadcn-ui/index';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@b-prism/shadcn-ui/index';
import { Button } from '@b-prism/shadcn-ui/index';
import { Badge } from '@b-prism/shadcn-ui/index';
import { Progress } from '@b-prism/shadcn-ui/index';
import React, { lazy, Suspense, useEffect } from 'react';
import { OverviewSkeleton, StatisticCardsSkeleton } from './_components/skeleton';
import { useRescuePostStore } from '../../stores/rescue-post-stores/rescue-post.store';

const StatisticCards = lazy(() => import('./_components/statistic-cards'));
const Overview = lazy(() => import('./_components/overview'));

export default function DashboardPage() {
    const { rescuePosts, isLoading, fetchAllRescuePosts } = useRescuePostStore();

    useEffect(() => {
        if (rescuePosts.length === 0 || !rescuePosts) {
            fetchAllRescuePosts();
        }
    }, []);

    return (
        <div className='flex flex-col w-full min-h-screen'>
            <div className='flex flex-col'>
                <main className='flex-1 p-4 space-y-4 md:p-6'>
                    <Suspense fallback={<StatisticCardsSkeleton />}>
                        <div id='step1'>
                            <StatisticCards
                                rescuePosts={rescuePosts}
                                isLoading={isLoading}
                            />
                        </div>
                    </Suspense>

                    <Tabs
                        defaultValue='overview'
                        className='space-y-4'>
                        <TabsList>
                            <TabsTrigger value='overview'>Overview</TabsTrigger>
                            <TabsTrigger value='rescue'>Rescue Operations</TabsTrigger>
                            <TabsTrigger value='resources'>Resource Management</TabsTrigger>
                            <TabsTrigger value='infrastructure'>Infrastructure</TabsTrigger>
                        </TabsList>

                        <TabsContent
                            value='overview'
                            className='space-y-4'>
                            <Suspense fallback={<OverviewSkeleton />}>
                                <Overview />
                            </Suspense>
                            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                                <Card className='bg-sidebar'>
                                    <CardHeader>
                                        <CardTitle>Recent Rescue Requests</CardTitle>
                                        <CardDescription>Latest incoming rescue requests</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className='space-y-4'>
                                            {[1, 2, 3].map((i) => (
                                                <div
                                                    key={i}
                                                    className='flex items-start gap-4 p-3 border rounded-lg'>
                                                    <AlertTriangle className={`mt-1 h-5 w-5 ${i === 1 ? 'text-red-500' : i === 2 ? 'text-orange-500' : 'text-blue-500'}`} />
                                                    <div className='flex-1 space-y-1'>
                                                        <p className='text-sm font-medium leading-none'>
                                                            {i === 1 ? 'Family trapped in flooding' : i === 2 ? 'Medical emergency' : 'Food and water needed'}
                                                        </p>
                                                        <p className='text-xs text-muted-foreground'>
                                                            {i === 1 ? 'Legazpi City, Albay' : i === 2 ? 'Naga City, Camarines Sur' : 'Sorsogon City, Sorsogon'}
                                                        </p>
                                                        <div className='flex items-center pt-1'>
                                                            <Users className='w-3 h-3 mr-1 text-muted-foreground' />
                                                            <span className='text-xs text-muted-foreground'>
                                                                {i === 1 ? '5 adults, 3 children' : i === 2 ? '2 adults, 1 elderly' : '4 adults, 2 children, 1 elderly'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Badge variant={i === 1 ? 'destructive' : i === 2 ? 'default' : 'outline'}>
                                                        {i === 1 ? 'High' : i === 2 ? 'Medium' : 'Low'}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            variant='outline'
                                            className='w-full'>
                                            View All Requests
                                        </Button>
                                    </CardFooter>
                                </Card>

                                <Card className='bg-sidebar'>
                                    <CardHeader>
                                        <CardTitle>Warehouse Distribution</CardTitle>
                                        <CardDescription>Resource allocation across warehouses</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className='h-[250px] rounded-md border bg-muted flex items-center justify-center'>
                                            <div className='text-center'>
                                                <Package className='w-12 h-12 mx-auto mb-2 text-muted-foreground' />
                                                <p className='text-sm text-muted-foreground'>Chart showing warehouse resource distribution</p>
                                                <p className='mt-1 text-xs text-muted-foreground'>(Chart visualization would be integrated here)</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className='flex justify-between'>
                                        <Button
                                            variant='ghost'
                                            size='sm'>
                                            <Warehouse className='w-4 h-4 mr-2' />
                                            Warehouse Details
                                        </Button>
                                        <Button
                                            variant='ghost'
                                            size='sm'>
                                            <Truck className='w-4 h-4 mr-2' />
                                            Logistics
                                        </Button>
                                    </CardFooter>
                                </Card>

                                <Card className='bg-sidebar'>
                                    <CardHeader>
                                        <CardTitle>Road Network Status</CardTitle>
                                        <CardDescription>Overview of damaged and accessible roads</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className='space-y-4'>
                                            <div className='flex items-center justify-between'>
                                                <div className='flex items-center gap-2'>
                                                    <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                                                    <span className='text-sm'>Severely Damaged</span>
                                                </div>
                                                <span className='text-sm font-medium'>18</span>
                                            </div>
                                            <div className='flex items-center justify-between'>
                                                <div className='flex items-center gap-2'>
                                                    <div className='w-3 h-3 bg-orange-500 rounded-full'></div>
                                                    <span className='text-sm'>Partially Damaged</span>
                                                </div>
                                                <span className='text-sm font-medium'>15</span>
                                            </div>
                                            <div className='flex items-center justify-between'>
                                                <div className='flex items-center gap-2'>
                                                    <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                                                    <span className='text-sm'>At Risk</span>
                                                </div>
                                                <span className='text-sm font-medium'>24</span>
                                            </div>
                                            <div className='flex items-center justify-between'>
                                                <div className='flex items-center gap-2'>
                                                    <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                                                    <span className='text-sm'>Accessible</span>
                                                </div>
                                                <span className='text-sm font-medium'>143</span>
                                            </div>
                                            <div className='pt-2'>
                                                <Button
                                                    variant='outline'
                                                    className='w-full text-xs'>
                                                    <Waypoints className='w-3 h-3 mr-2' />
                                                    View Road Network Map
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent
                            value='rescue'
                            className='space-y-4'>
                            <Card className='bg-sidebar'>
                                <CardHeader>
                                    <CardTitle>Rescue Operations Dashboard</CardTitle>
                                    <CardDescription>Detailed view of rescue requests and demographic analysis</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className='grid gap-4 md:grid-cols-2'>
                                        <div className='h-[400px] rounded-md border bg-muted flex items-center justify-center'>
                                            <div className='text-center'>
                                                <LifeBuoy className='w-12 h-12 mx-auto mb-2 text-muted-foreground' />
                                                <p className='text-sm text-muted-foreground'>Rescue request heatmap with demographic filters</p>
                                                <p className='mt-1 text-xs text-muted-foreground'>Filter by adults, children, elderly</p>
                                            </div>
                                        </div>
                                        <div className='space-y-4'>
                                            <Card>
                                                <CardHeader className='py-3'>
                                                    <CardTitle className='text-sm'>Demographic Breakdown</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className='space-y-2'>
                                                        <div className='flex items-center justify-between'>
                                                            <span className='text-sm'>Adults</span>
                                                            <span className='text-sm font-medium'>342 (58.2%)</span>
                                                        </div>
                                                        <Progress
                                                            value={58.2}
                                                            className='h-2'
                                                        />
                                                        <div className='flex items-center justify-between'>
                                                            <span className='text-sm'>Children</span>
                                                            <span className='text-sm font-medium'>156 (26.5%)</span>
                                                        </div>
                                                        <Progress
                                                            value={26.5}
                                                            className='h-2'
                                                        />
                                                        <div className='flex items-center justify-between'>
                                                            <span className='text-sm'>Elderly</span>
                                                            <span className='text-sm font-medium'>89 (15.3%)</span>
                                                        </div>
                                                        <Progress
                                                            value={15.3}
                                                            className='h-2'
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardHeader className='py-3'>
                                                    <CardTitle className='text-sm'>Location Analysis</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className='space-y-2'>
                                                        <div className='flex items-center justify-between'>
                                                            <span className='text-sm'>Legazpi City</span>
                                                            <span className='text-sm font-medium'>42 requests</span>
                                                        </div>
                                                        <Progress
                                                            value={42}
                                                            max={127}
                                                            className='h-2'
                                                        />
                                                        <div className='flex items-center justify-between'>
                                                            <span className='text-sm'>Naga City</span>
                                                            <span className='text-sm font-medium'>35 requests</span>
                                                        </div>
                                                        <Progress
                                                            value={35}
                                                            max={127}
                                                            className='h-2'
                                                        />
                                                        <div className='flex items-center justify-between'>
                                                            <span className='text-sm'>Sorsogon City</span>
                                                            <span className='text-sm font-medium'>28 requests</span>
                                                        </div>
                                                        <Progress
                                                            value={28}
                                                            max={127}
                                                            className='h-2'
                                                        />
                                                        <div className='flex items-center justify-between'>
                                                            <span className='text-sm'>Other Areas</span>
                                                            <span className='text-sm font-medium'>22 requests</span>
                                                        </div>
                                                        <Progress
                                                            value={22}
                                                            max={127}
                                                            className='h-2'
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent
                            value='resources'
                            className='space-y-4'>
                            <Card className='bg-sidebar'>
                                <CardHeader>
                                    <CardTitle>Warehouse Resource Management</CardTitle>
                                    <CardDescription>Inventory and distribution of critical supplies</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className='grid gap-4 md:grid-cols-2'>
                                        <div className='h-[400px] rounded-md border bg-muted flex items-center justify-center'>
                                            <div className='text-center'>
                                                <Package className='w-12 h-12 mx-auto mb-2 text-muted-foreground' />
                                                <p className='text-sm text-muted-foreground'>Map showing warehouse locations and inventory levels</p>
                                                <p className='mt-1 text-xs text-muted-foreground'>(Map visualization would be integrated here)</p>
                                            </div>
                                        </div>
                                        <div className='space-y-4'>
                                            <Card>
                                                <CardHeader className='py-3'>
                                                    <CardTitle className='text-sm'>Family Food Packs</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className='space-y-4'>
                                                        <div>
                                                            <div className='flex items-center justify-between'>
                                                                <span className='text-sm'>Total Available</span>
                                                                <span className='text-sm font-medium'>4,250 packs</span>
                                                            </div>
                                                            <Progress
                                                                value={72}
                                                                className='h-2 mt-1'
                                                            />
                                                        </div>
                                                        <div className='grid grid-cols-2 gap-4'>
                                                            <div>
                                                                <div className='mb-1 text-xs text-muted-foreground'>Distributed (Last 7 days)</div>
                                                                <div className='text-lg font-medium'>1,845</div>
                                                            </div>
                                                            <div>
                                                                <div className='mb-1 text-xs text-muted-foreground'>Incoming Supply</div>
                                                                <div className='text-lg font-medium'>2,000</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardHeader className='py-3'>
                                                    <CardTitle className='text-sm'>Standby Funds</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className='space-y-4'>
                                                        <div>
                                                            <div className='flex items-center justify-between'>
                                                                <span className='text-sm'>Available Funds</span>
                                                                <span className='text-sm font-medium'>₱2,450,000</span>
                                                            </div>
                                                            <Progress
                                                                value={43}
                                                                className='h-2 mt-1'
                                                            />
                                                        </div>
                                                        <div className='grid grid-cols-2 gap-4'>
                                                            <div>
                                                                <div className='mb-1 text-xs text-muted-foreground'>Utilized (Last 7 days)</div>
                                                                <div className='text-lg font-medium'>₱1,250,000</div>
                                                            </div>
                                                            <div>
                                                                <div className='mb-1 text-xs text-muted-foreground'>Allocated Budget</div>
                                                                <div className='text-lg font-medium'>₱5,000,000</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardHeader className='py-3'>
                                                    <CardTitle className='text-sm'>Non-Food Items</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className='grid grid-cols-2 gap-4 text-sm'>
                                                        <div className='flex justify-between'>
                                                            <span>Blankets</span>
                                                            <span className='font-medium'>1,250</span>
                                                        </div>
                                                        <div className='flex justify-between'>
                                                            <span>Hygiene Kits</span>
                                                            <span className='font-medium'>2,100</span>
                                                        </div>
                                                        <div className='flex justify-between'>
                                                            <span>Sleeping Mats</span>
                                                            <span className='font-medium'>980</span>
                                                        </div>
                                                        <div className='flex justify-between'>
                                                            <span>Water Containers</span>
                                                            <span className='font-medium'>1,540</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent
                            value='infrastructure'
                            className='space-y-4'>
                            <Card className='bg-sidebar'>
                                <CardHeader>
                                    <CardTitle>Road Network Status</CardTitle>
                                    <CardDescription>Detailed view of road conditions and accessibility</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className='grid gap-4 md:grid-cols-2'>
                                        <div className='h-[400px] rounded-md border bg-muted flex items-center justify-center'>
                                            <div className='text-center'>
                                                <Waypoints className='w-12 h-12 mx-auto mb-2 text-muted-foreground' />
                                                <p className='text-sm text-muted-foreground'>Interactive map showing road network status</p>
                                                <p className='mt-1 text-xs text-muted-foreground'>(Map visualization would be integrated here)</p>
                                                <p className='mt-1 text-xs text-muted-foreground'>Using RoadNetwork data with damage indicators</p>
                                            </div>
                                        </div>
                                        <div className='space-y-4'>
                                            <Card>
                                                <CardHeader className='py-3'>
                                                    <CardTitle className='text-sm'>Damage Analysis</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className='space-y-2'>
                                                        <div className='flex items-center justify-between'>
                                                            <div className='flex items-center gap-2'>
                                                                <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                                                                <span className='text-sm'>Severely Damaged</span>
                                                            </div>
                                                            <span className='text-sm font-medium'>18 roads</span>
                                                        </div>
                                                        <Progress
                                                            value={18}
                                                            max={200}
                                                            className='h-2'
                                                        />
                                                        <div className='flex items-center justify-between'>
                                                            <div className='flex items-center gap-2'>
                                                                <div className='w-3 h-3 bg-orange-500 rounded-full'></div>
                                                                <span className='text-sm'>Partially Damaged</span>
                                                            </div>
                                                            <span className='text-sm font-medium'>15 roads</span>
                                                        </div>
                                                        <Progress
                                                            value={15}
                                                            max={200}
                                                            className='h-2'
                                                        />
                                                        <div className='flex items-center justify-between'>
                                                            <div className='flex items-center gap-2'>
                                                                <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                                                                <span className='text-sm'>At Risk (High Probability)</span>
                                                            </div>
                                                            <span className='text-sm font-medium'>24 roads</span>
                                                        </div>
                                                        <Progress
                                                            value={24}
                                                            max={200}
                                                            className='h-2'
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardHeader className='py-3'>
                                                    <CardTitle className='text-sm'>Critical Routes</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className='space-y-3'>
                                                        <div className='flex items-start gap-3 p-2 border rounded-lg'>
                                                            <div className='w-3 h-3 mt-1 bg-red-500 rounded-full'></div>
                                                            <div>
                                                                <p className='text-sm font-medium'>Daet-Legazpi Highway</p>
                                                                <p className='text-xs text-muted-foreground'>Multiple sections damaged by flooding</p>
                                                            </div>
                                                        </div>
                                                        <div className='flex items-start gap-3 p-2 border rounded-lg'>
                                                            <div className='w-3 h-3 mt-1 bg-orange-500 rounded-full'></div>
                                                            <div>
                                                                <p className='text-sm font-medium'>Naga-Legazpi Road</p>
                                                                <p className='text-xs text-muted-foreground'>Landslide affecting northern section</p>
                                                            </div>
                                                        </div>
                                                        <div className='flex items-start gap-3 p-2 border rounded-lg'>
                                                            <div className='w-3 h-3 mt-1 bg-yellow-500 rounded-full'></div>
                                                            <div>
                                                                <p className='text-sm font-medium'>Sorsogon-Samar Link</p>
                                                                <p className='text-xs text-muted-foreground'>At risk due to rising water levels</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardHeader className='py-3'>
                                                    <CardTitle className='text-sm'>Route Optimization</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className='space-y-2'>
                                                        <p className='text-xs text-muted-foreground'>Alternative routes available for critical areas</p>
                                                        <Button
                                                            variant='outline'
                                                            className='w-full mt-2 text-xs'>
                                                            <Truck className='w-3 h-3 mr-2' />
                                                            Generate Optimal Routes
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
                        <Card className='lg:col-span-4 bg-sidebar'>
                            <CardHeader>
                                <CardTitle>Activity Timeline</CardTitle>
                                <CardDescription>Recent system activities and rescue operations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='space-y-4'>
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className='flex gap-4'>
                                            <div className='relative flex flex-col items-center'>
                                                <div
                                                    className={`flex h-8 w-8 items-center justify-center rounded-full border ${i === 1 ? 'bg-red-100 border-red-500 text-red-500' : 'bg-muted border-muted-foreground/20 text-muted-foreground'}`}>
                                                    {i === 1 ? (
                                                        <AlertTriangle className='w-4 h-4' />
                                                    ) : i === 2 ? (
                                                        <Users className='w-4 h-4' />
                                                    ) : i === 3 ? (
                                                        <Truck className='w-4 h-4' />
                                                    ) : (
                                                        <Waypoints className='w-4 h-4' />
                                                    )}
                                                </div>
                                                {i !== 4 && <div className='absolute bottom-0 w-px -translate-x-1/2 top-8 left-1/2 bg-muted-foreground/20' />}
                                            </div>
                                            <div className='flex flex-col pb-6'>
                                                <span className='text-sm font-medium'>
                                                    {i === 1
                                                        ? 'New Rescue Request'
                                                        : i === 2
                                                          ? 'Rescue Post Updated'
                                                          : i === 3
                                                            ? 'Warehouse Inventory Updated'
                                                            : 'Road Status Changed'}
                                                </span>
                                                <span className='text-xs text-muted-foreground'>
                                                    {i === 1
                                                        ? 'Apr 2, 2025 - 08:30 AM'
                                                        : i === 2
                                                          ? 'Apr 2, 2025 - 10:15 AM'
                                                          : i === 3
                                                            ? 'Apr 2, 2025 - 01:45 PM'
                                                            : 'Apr 2, 2025 - 03:20 PM'}
                                                </span>
                                                <p className='mt-1 text-xs text-muted-foreground'>
                                                    {i === 1
                                                        ? 'New rescue request received from Legazpi City with 8 people affected.'
                                                        : i === 2
                                                          ? 'Updated demographic information for rescue post in Naga City.'
                                                          : i === 3
                                                            ? 'Warehouse inventory updated with new family food packs and non-food items.'
                                                            : 'Road status updated: Daet-Legazpi Highway marked as damaged.'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    variant='outline'
                                    className='w-full'>
                                    View All Activities
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card className='lg:col-span-3 bg-sidebar'>
                            <CardHeader>
                                <CardTitle>System Notifications</CardTitle>
                                <CardDescription>Important alerts and system updates</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='space-y-4'>
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className='flex items-start gap-4 p-3 border rounded-lg'>
                                            <AlertTriangle className={`mt-1 h-5 w-5 ${i === 1 ? 'text-red-500' : i === 2 ? 'text-orange-500' : 'text-blue-500'}`} />
                                            <div className='flex-1 space-y-1'>
                                                <p className='text-sm font-medium leading-none'>
                                                    {i === 1
                                                        ? 'Critical: High concentration of rescue requests'
                                                        : i === 2
                                                          ? 'Warning: Low warehouse resources'
                                                          : 'Info: Road network updated'}
                                                </p>
                                                <p className='text-xs text-muted-foreground'>
                                                    {i === 1
                                                        ? 'Multiple rescue requests detected in Legazpi City area.'
                                                        : i === 2
                                                          ? 'Water supplies below 50% in main warehouse.'
                                                          : 'Road network data has been updated with latest damage reports.'}
                                                </p>
                                                <div className='flex items-center pt-1'>
                                                    <Clock className='w-3 h-3 mr-1 text-muted-foreground' />
                                                    <span className='text-xs text-muted-foreground'>
                                                        {i === 1 ? '10 minutes ago' : i === 2 ? '25 minutes ago' : '42 minutes ago'}
                                                    </span>
                                                </div>
                                            </div>
                                            <Badge variant={i === 1 ? 'destructive' : i === 2 ? 'default' : 'outline'}>{i === 1 ? 'Critical' : i === 2 ? 'Warning' : 'Info'}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    variant='outline'
                                    className='w-full'>
                                    View All Notifications
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
