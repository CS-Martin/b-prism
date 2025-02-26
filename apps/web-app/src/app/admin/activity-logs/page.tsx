'use client';

import { useEffect, useRef, useState } from 'react';
import Topbar from 'apps/web-app/src/components/topbar';
import { useDisplayActivityLogs } from 'apps/web-app/src/hooks/activity-log.hook';
import { format } from 'date-fns';
import ActionIcon from './_components/action-icon';
import ActivityCard from './_components/activity-card';
import { Input, Menubar, MenubarCheckboxItem, MenubarContent, MenubarMenu, MenubarShortcut, MenubarTrigger } from '@b-prism/shadcn-ui/index';
import { ChevronDown } from 'lucide-react';

export default function ActivityLogPage() {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { logs, isLoading } = useDisplayActivityLogs();
    const [visibleLogs, setVisibleLogs] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedActions, setSelectedActions] = useState<string[]>(['Create', 'Update', 'Delete']);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [logs]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const element = e.currentTarget;
        if (element.scrollTop === -(element.scrollHeight - element.clientHeight)) {
            setVisibleLogs((prev) => Math.min(prev + 10, logs.length));
        }
    };

    const toggleActionFilter = (action: string) => {
        setSelectedActions((prev) => (prev.includes(action) ? prev.filter((a) => a !== action) : [...prev, action]));
    };

    // Normalize action type to ensure consistency
    const normalizeAction = (action: string) => action.toLowerCase();

    // If no actions are selected, show all logs
    const filteredLogs = logs.filter((log) => {
        const logAction = normalizeAction(log.action);
        const isActionMatch = selectedActions.length === 0 || selectedActions.map(normalizeAction).includes(logAction);

        const isSearchMatch = [log.description, log.author, format(new Date(log.timestamp), 'hh:mm a')].some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()));

        return isActionMatch && isSearchMatch;
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='px-3 h-full w-full'>
            <Topbar
                items={[
                    { label: 'Admin', href: '/' },
                    { label: 'Activity Logs History', href: '/admin/activity-logs' },
                ]}
            />

            <div className='prism-card-bg rounded-md py-6 w-full max-w-7xl mt-6'>
                {/* 🔍 Search & Menubar */}
                <div className='px-4 pb-4 flex items-center gap-4 border-b flex-nowrap'>
                    <Input
                        type='text'
                        placeholder='Search activity logs...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='flex-1 min-w-0 p-2 border rounded-md shadow-sm'
                    />
                    {/* Menubar for action filters */}
                    <Menubar className='w-auto'>
                        <MenubarMenu>
                            <MenubarTrigger className='cursor-pointer flex items-center gap-2 group'>
                                Filter by Action
                                <ChevronDown
                                    size={16}
                                    className='transition-transform duration-200 group-data-[state=open]:rotate-180'
                                />
                            </MenubarTrigger>
                            <MenubarContent forceMount>
                                {['Create', 'Update', 'Delete'].map((action) => (
                                    <MenubarCheckboxItem
                                        key={action}
                                        checked={selectedActions.includes(action)}
                                        onCheckedChange={() => toggleActionFilter(action)}
                                        className='cursor-pointer'
                                        onSelect={(event) => event.preventDefault()}>
                                        {action}
                                    </MenubarCheckboxItem>
                                ))}
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                </div>

                <div
                    className='relative h-[40rem] md:h-[45rem] px-4 md:px-6 flex flex-col-reverse overflow-y-scroll'
                    ref={scrollAreaRef}
                    onScroll={handleScroll}>
                    {filteredLogs.length > 0 ? (
                        filteredLogs.slice(0, visibleLogs).map((log, index) => (
                            <div
                                key={index}
                                className='relative flex items-start h-fit rounded-md'>
                                <div className='relative flex flex-col items-center h-full py-2'>
                                    {ActionIcon(log.action)}
                                    {index > 0 && <div className='h-[60%] rounded-full w-[0.7px] bg-gray-500 absolute top-11'></div>}
                                </div>

                                <div className='flex flex-col md:flex-row'>
                                    <div className='ml-6 w-full md:text-center py-2 min-w-[80px] md:max-w-[200px]'>
                                        <p className='text-[#a1a1aa] text-xs md:text-sm'>{format(new Date(log.timestamp), 'hh:mm a')}</p>
                                    </div>

                                    {ActivityCard(log)}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='text-center text-gray-500'>No logs found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
