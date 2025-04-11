'use client';

import { lazy, Suspense, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, ChevronDown, Download, Filter, LifeBuoy, MapPin, Phone, Search, SlidersHorizontal, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@b-prism/shadcn-ui/index';
import { Button } from '@b-prism/shadcn-ui/index';
import { Badge } from '@b-prism/shadcn-ui/index';
import { Input } from '@b-prism/shadcn-ui/index';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@b-prism/shadcn-ui/index';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@b-prism/shadcn-ui/index';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@b-prism/shadcn-ui/index';
import { Switch } from '@b-prism/shadcn-ui/index';
import { Label } from '@b-prism/shadcn-ui/index';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@b-prism/shadcn-ui/index';
import { RescueRequestHeatmap } from '../../dashboard/_components/overview';
import { useRescuePostStore } from 'apps/web-app/src/stores/rescue-post-stores/rescue-post.store';
import { useProgress } from '@bprogress/next';
import { RescueManagementContent } from './_components/rescue-datatable';
import { RescueStatisticsCardsSkeleton } from './_components/skeletons';
import { Session } from 'next-auth';

const RescueStatisticCards = lazy(() => import('./_components/rescue-statistic-cards'));

interface RescuePostsDashboardProps {
    session: Session | null;
}

export default function RescuePostsDashboard({ session }: RescuePostsDashboardProps) {
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

    if (!session) {
        return <div>Loading...</div>;
    }

    return (
        <div className='flex flex-col w-full min-h-screen'>
            <div className='flex flex-col'>
                <main className='flex-1 p-4 space-y-4 md:p-6'>
                    <Suspense fallback={<RescueStatisticsCardsSkeleton />}>
                        <RescueStatisticCards rescuePosts={rescuePosts} />
                    </Suspense>

                    <Tabs
                        defaultValue='table'
                        className='space-y-4'>
                        <TabsList>
                            <TabsTrigger value='table'>Table View</TabsTrigger>
                            <TabsTrigger value='map'>Map View</TabsTrigger>
                        </TabsList>

                        <TabsContent
                            value='table'
                            className='space-y-4'>
                            <div className='flex flex-col gap-4'>
                                <RescueManagementContent
                                    rescuePosts={rescuePosts}
                                    session={session}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                    <Card className='bg-sidebar'>
                        <CardHeader>
                            <CardTitle>Rescue Posts Map</CardTitle>
                            <CardDescription>Geographical distribution of rescue requests</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='h-[500px] rounded-md border bg-muted flex items-center justify-center'>
                                <RescueRequestHeatmap rescuePosts={rescuePosts} />
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}
