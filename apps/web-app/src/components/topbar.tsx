'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Separator, SidebarTrigger } from '@b-prism/shadcn-ui/index';
import { Breadcrumbs } from './breadcrumbs';
import { ThemeToggler } from './theme-toggler';
import { useEffect, useState } from 'react';
import { useAnalyticalDashboardStore } from '../stores/dashboard-stores/analytical-dashboard.store';

interface TopBarProps {
    items: {
        label: string;
        href: string;
    }[];
}

const Topbar = ({ items }: TopBarProps) => {
    const [timeRange, setTimeRange] = useState('24h');
    const { setSelectedRange } = useAnalyticalDashboardStore();

    useEffect(() => {
        setSelectedRange(timeRange);
    }, [timeRange, setSelectedRange]);

    return (
        <div className='flex flex-row items-center justify-between p-5 border-b bg-sidebar'>
            <div className='flex flex-row items-center gap-4'>
                <SidebarTrigger />
                <Separator orientation='vertical' />
                <div className='flex items-center gap-4'>
                    <Breadcrumbs items={items} />
                </div>
            </div>
            <div className='flex flex-row items-center gap-4'>
                <div className='flex items-center gap-4 ml-auto'>
                    <Select
                        defaultValue={timeRange}
                        onValueChange={setTimeRange}>
                        <SelectTrigger className='w-[150px]'>
                            <SelectValue placeholder='Select time range' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='24h'>Last 24 hours</SelectItem>
                            <SelectItem value='7d'>Last 7 days</SelectItem>
                            <SelectItem value='30d'>Last 30 days</SelectItem>
                            <SelectItem value='90d'>Last 90 days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <ThemeToggler />
            </div>
        </div>
    );
};

export default Topbar;
