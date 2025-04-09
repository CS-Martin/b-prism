'use client';

import { useEffect, useRef, useState } from 'react';
import Topbar from 'apps/web-app/src/components/topbar';
import { format } from 'date-fns';
import ActionIcon from './action-icon';
import ActivityCard from './activity-card';
import { Input, Menubar, MenubarCheckboxItem, MenubarContent, MenubarMenu, MenubarTrigger } from '@b-prism/shadcn-ui/index';
import { ChevronDown, Search } from 'lucide-react';
import { useDisplayActivityLogs } from 'apps/web-app/src/hooks/activity-log.hook';
import { useProgress } from '@bprogress/next';

interface ActivityLogProps {
    token?: string;
}

export default function ActivityLog({ token }: ActivityLogProps) {
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const { start: loadStart, stop: loadStop } = useProgress();
    const { logs, isLoading } = useDisplayActivityLogs(token);
    const [visibleLogs, setVisibleLogs] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedActions, setSelectedActions] = useState<string[]>(['Create', 'Update', 'Delete']);

    if (isLoading) {
        loadStart();
    } else {
        loadStop();
    }

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

    const normalizeAction = (action: string) => action.toLowerCase();

    const filteredLogs = logs.filter((log) => {
        const logAction = normalizeAction(log.action);
        const isActionMatch = selectedActions.length === 0 || selectedActions.map(normalizeAction).includes(logAction);

        const isSearchMatch = [log.description, log.author, format(new Date(log.timestamp), 'hh:mm a')].some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()));

        return isActionMatch && isSearchMatch;
    });

    return (
        <div className='w-full h-full px-5 mt-3'>
            <div className='w-full max-w-full px-3 py-5 border rounded-md shadow-sm bg-sidebar'>
                <div className='flex flex-col items-center gap-4 px-4 pb-4 border-b md:flex-row flex-nowrap'>
                    <div className='relative flex items-center flex-1 w-full min-w-0'>
                        <Search
                            size={18}
                            className='absolute text-gray-500 left-3'
                        />
                        <Input
                            type='text'
                            placeholder='Search activity logs...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='flex-1 min-w-0 p-2 pl-10 border rounded-md shadow-sm'
                        />
                    </div>
                    <Menubar className='w-auto'>
                        <MenubarMenu>
                            <MenubarTrigger className='flex items-center gap-2 cursor-pointer group'>
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
                                className='relative flex items-start rounded-md h-fit'>
                                <div className='relative flex flex-col items-center h-full py-2'>
                                    {ActionIcon(log.action)}
                                    {index > 0 && <div className='h-[60%] rounded-full w-[0.7px] bg-gray-500 absolute top-11'></div>}
                                </div>

                                <div className='flex flex-col w-full md:flex-row'>
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
