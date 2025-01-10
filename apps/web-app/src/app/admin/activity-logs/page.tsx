'use client';

import { Avatar, AvatarFallback, AvatarImage, ScrollArea } from '@b-prism/shadcn-ui/index';
import Topbar from 'apps/web-app/src/components/topbar';
import { useDisplayActivityLogs } from 'apps/web-app/src/hooks/activity-log.hook';
import { format, formatDistanceToNow } from 'date-fns';
import ActionIcon from './_components/action-icon';
import ActivityCard from './_components/activity-card';
import { useEffect, useRef, useState } from 'react';

export default function ActivityLogging() {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { logs, isLoading, fetchAllActivityLogs } = useDisplayActivityLogs();
    const [visibleLogs, setVisibleLogs] = useState(10);

    console.log(logs);

    useEffect(() => {
        // Scrolldown on render
        scrollAreaRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='px-3 h-[100%]'>
            <Topbar
                items={[
                    { label: 'Links', href: '/' },
                    { label: 'Activity Logs', href: '/admin/activity-logs' },
                ]}
            />

            <div className='bg-[#18181A] rounded-md py-6 w-[80%] mt-6'>
                {/* If scroll hits the top, show 'show more' button */}
                <ScrollArea className='relative h-[45rem] px-6'>
                    {/* Timeline Items */}
                    {logs.map((log, index) => (
                        <div
                            key={index}
                            ref={scrollAreaRef}
                            className='relative flex items-start h-[120px] rounded-md'>
                            {/* Circle and Line */}
                            <div className='relative flex flex-col items-center h-full py-2'>
                                {/* Circle */}
                                {ActionIcon(log.action)}

                                {/* Line below the circle */}
                                {index < logs.length - 1 && <div className='h-[60%] rounded-full w-[0.7px] bg-gray-500 absolute top-11'></div>}
                            </div>
                            <div className='ml-10 w-full text-center py-2 max-w-[120px]'>
                                <p className='text-[#a1a1aa] text-[12px]'>{format(new Date(log.timestamp), 'hh:mm a')}</p>
                            </div>

                            {ActivityCard(log)}
                        </div>
                    ))}
                </ScrollArea>
            </div>
        </div>
    );
}
