'use client';

import Topbar from 'apps/web-app/src/components/topbar';
import { useDisplayActivityLogs } from 'apps/web-app/src/hooks/activity-log.hook';
import { format } from 'date-fns';
import ActionIcon from './_components/action-icon';
import ActivityCard from './_components/activity-card';
import { useEffect, useRef, useState } from 'react';

export default function ActivityLogging() {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { logs, isLoading, fetchAllActivityLogs } = useDisplayActivityLogs();
    const [visibleLogs, setVisibleLogs] = useState(10);

    console.log(logs);

    useEffect(() => {
        // Scroll to the bottom on initial render and when logs update
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [logs]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const element = e.currentTarget;

        // If the user scrolls to the bottom, load more logs
        if (element.scrollTop === -(element.scrollHeight - element.clientHeight)) {
            setVisibleLogs((prev) => Math.min(prev + 10, logs.length));
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='px-3 h-[100%]'>
            <Topbar
                items={[
                    { label: 'Admin', href: '/' },
                    { label: 'Activity Logs History', href: '/admin/activity-logs' },
                ]}
            />

            <div className='bg-[#18181A] rounded-md py-6 w-[80%] mt-6'>
                <div
                    className='relative h-[45rem] px-6 flex flex-col-reverse overflow-y-scroll'
                    ref={scrollAreaRef}
                    onScroll={handleScroll}>
                    {logs.slice(0, visibleLogs).map((log, index) => (
                        <div
                            key={index}
                            className='relative flex items-start h-fit rounded-md'>
                            {/* Circle and Line */}
                            <div className='relative flex flex-col items-center h-full py-2'>
                                {/* Circle */}
                                {ActionIcon(log.action)}
                                {/* Line below the circle */}
                                {index > 0 && <div className='h-[60%] rounded-full w-[0.7px] bg-gray-500 absolute top-11'></div>}
                            </div>

                            <div className='ml-10 w-full text-center py-2 max-w-[120px]'>
                                <p className='text-[#a1a1aa] text-[12px]'>{format(new Date(log.timestamp), 'hh:mm a')}</p>
                            </div>

                            {ActivityCard(log)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
