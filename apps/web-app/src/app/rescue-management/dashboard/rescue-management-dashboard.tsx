'use client';

import { useEffect, useState } from 'react';
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
import { RescueStatisticCards } from './_components/rescue-statistic-cards';
import { RescueRequestHeatmap } from '../../dashboard/_components/overview';
import { useRescuePostStore } from 'apps/web-app/src/stores/rescue-post-stores/rescue-post.store';
import { useProgress } from '@bprogress/next';

export default function RescuePostsDashboard() {
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

    console.log('Rescue Posts:', rescuePosts);

    return (
        <div className='flex flex-col w-full min-h-screen bg-muted/40'>
            <div className='flex flex-col'>
                <main className='flex-1 p-4 space-y-4 md:p-6'>
                    <RescueStatisticCards rescuePosts={rescuePosts} />

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
                                <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                                    <div className='flex items-center w-full gap-2 md:w-1/2'>
                                        <Search className='w-4 h-4 text-muted-foreground' />
                                        <Input
                                            placeholder='Search by location or contact name...'
                                            className='h-9'
                                        />
                                    </div>
                                </div>

                                <Card>
                                    <CardContent className='p-0'>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className='w-[100px]'>Status</TableHead>
                                                    <TableHead>Location</TableHead>
                                                    <TableHead>People</TableHead>
                                                    <TableHead>Contact</TableHead>
                                                    <TableHead>Created</TableHead>
                                                    <TableHead className='text-right'>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                        </Table>
                                    </CardContent>
                                    <CardFooter className='flex items-center justify-between p-4 border-t'>
                                        <div className='flex items-center gap-2'>
                                            <Button
                                                variant='outline'
                                                size='sm'
                                                disabled>
                                                Previous
                                            </Button>
                                            <Button
                                                variant='outline'
                                                size='sm'
                                                disabled>
                                                Next
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                    <Card>
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
