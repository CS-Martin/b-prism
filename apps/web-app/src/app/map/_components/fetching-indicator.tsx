import { useSidebar } from '@b-prism/shadcn-ui/index';
import { useDispensingPointsStore } from 'apps/web-app/src/stores/map-stores/dispensing-point.store';
import { useRoadNetworkStore } from 'apps/web-app/src/stores/map-stores/road-network.store';
import { useWarehouseStore } from 'apps/web-app/src/stores/map-stores/warehouse.store';
import { Clock, House, Loader2, MapPin, Pin, Terminal } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const FetchingIndicator: React.FC = () => {
    const { state } = useSidebar();
    const { isLoading: isFetchingWarehouses } = useWarehouseStore();
    const { isLoading: isFetchingDispensingPoints } = useDispensingPointsStore();
    const { isLoading: isFetchingRoadNetwork } = useRoadNetworkStore();

    const [time, setTime] = useState<string>(formatDate(new Date()));

    function formatDate(date: Date) {
        return date.toLocaleString('en-US', { month: 'long', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(formatDate(new Date()));
        }, 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={`absolute transition-all duration-300 bottom-0 text-[12px] cursor-move z-10 p-1  flex flex-row items-center justify-between bg-sidebar ${state === 'collapsed' ? 'md:left-6 left-0 md:w-[calc(100%-22px)]' : 'lg:left-[19rem] w-[calc(100%-19rem)]'}`}>
            <div className='flex flex-row items-center gap-x-2'>
                <Terminal className='w-4 h-4' />

                <div className='flex flex-row items-center gap-x-2'>
                    {isFetchingWarehouses ? (
                        <>
                            <Loader2 className='w-5 h-5 text-yellow-500 animate-spin' />
                            <small className='text-yellow-500 lg:hidden'>Loading...</small>
                            <small className='hidden text-yellow-500 lg:block'>Loading warehouses. Please wait.</small>
                        </>
                    ) : (
                        <>
                            <House className='h-3.5 w-3.5' />

                            <small className=' lg:hidden'>Ready</small>
                            <small className='hidden lg:block'>Warehouse ready.</small>
                        </>
                    )}
                </div>

                <div className='flex flex-row items-center gap-x-2'>
                    {isFetchingDispensingPoints ? (
                        <>
                            <Loader2 className='w-5 h-5 text-yellow-500 animate-spin' />
                            <small className='text-yellow-500 lg:hidden'>Loading...</small>
                            <small className='hidden text-yellow-500 lg:block'>Loading warehouses. Please wait.</small>
                        </>
                    ) : (
                        <>
                            <MapPin className='h-3.5 w-3.5 ' />
                            <small className=' lg:hidden'>Ready</small>
                            <small className='hidden lg:block'>Dispensing points ready.</small>
                        </>
                    )}
                </div>

                <div className='flex flex-row gap-x-2'>
                    {isFetchingRoadNetwork ? (
                        <>
                            <Loader2 className='w-5 h-5 text-yellow-500 animate-spin' />
                            <small className='text-yellow-500 lg:hidden'>Loading...</small>
                            <small className='hidden text-yellow-500 lg:block'>Loading road data. Please wait.</small>
                        </>
                    ) : (
                        <>
                            <Image
                                src={'/icons/road.svg'}
                                height={20}
                                width={20}
                                alt='road icon'
                            />
                            <small className=' lg:hidden'>Ready</small>
                            <small className='hidden lg:block'>Road network ready.</small>
                        </>
                    )}
                </div>
            </div>
            <div className='flex flex-row items-center pr-2 gap-x-2'>
                <Clock
                    height={14}
                    width={14}></Clock>
                <small>{time}</small>
            </div>
        </div>
    );
};

export default FetchingIndicator;
