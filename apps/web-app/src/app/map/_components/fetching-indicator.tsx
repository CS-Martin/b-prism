import { useSidebar } from '@b-prism/shadcn-ui/index';
import { House, Loader2, MapPin, Pin, Terminal } from 'lucide-react';
import Image from 'next/image';
import Draggable from 'react-draggable';

interface FetchingIndicatorProps {
    isFetchingWarehouses?: boolean;
    isFetchingDispensingPoints?: boolean;
    isFetchingRoadNetwork?: boolean;
}

const FetchingIndicator: React.FC<FetchingIndicatorProps> = ({ isFetchingWarehouses, isFetchingDispensingPoints, isFetchingRoadNetwork }) => {
    const { state } = useSidebar();

    return (
        <Draggable
            handle='.drag-handle'
            bounds='parent'>
            <div
                className={`absolute drag-handle bottom-0 text-[14px] cursor-move p-1.5 z-50 md:w-fit flex flex-row items-center gap-3 bg-black lg:bg-transparent w-full ${state === 'collapsed' ? 'lg:left-20 left-0 ' : 'lg:left-[19rem]'}`}>
                <Terminal className='h-4 w-4' />

                <div className='flex flex-row gap-x-2 items-center'>
                    {isFetchingWarehouses ? (
                        <>
                            <Loader2 className='h-5 w-5 animate-spin text-yellow-500' />
                            <small className='text-yellow-500 lg:hidden'>Loading...</small>
                            <small className='text-yellow-500 hidden lg:block'>Loading warehouses. Please wait.</small>
                        </>
                    ) : (
                        <>
                            <House className='h-3.5 w-3.5' />

                            <small className='text-white lg:hidden'>Ready</small>
                            <small className='text-white hidden lg:block'>Warehouse ready.</small>
                        </>
                    )}
                </div>

                <div className='flex flex-row gap-x-2 items-center'>
                    {isFetchingDispensingPoints ? (
                        <>
                            <Loader2 className='h-5 w-5 animate-spin text-yellow-500' />
                            <small className='text-yellow-500 lg:hidden'>Loading...</small>
                            <small className='text-yellow-500 hidden lg:block'>Loading warehouses. Please wait.</small>
                        </>
                    ) : (
                        <>
                            <MapPin className='h-3.5 w-3.5' />
                            <small className='text-white lg:hidden'>Ready</small>
                            <small className='text-white hidden lg:block'>Dispensing points ready.</small>
                        </>
                    )}
                </div>

                <div className='flex flex-row gap-x-2'>
                    {isFetchingRoadNetwork ? (
                        <>
                            <Loader2 className='h-5 w-5 animate-spin text-yellow-500' />
                            <small className='text-yellow-500 lg:hidden'>Loading...</small>
                            <small className='text-yellow-500 hidden lg:block'>Loading road data. Please wait.</small>
                        </>
                    ) : (
                        <>
                            <Image
                                src={'/icons/road.svg'}
                                height={20}
                                width={20}
                                alt='road icon'
                            />
                            <small className='text-white lg:hidden'>Ready</small>
                            <small className='text-white hidden lg:block'>Road network ready.</small>
                        </>
                    )}
                </div>
            </div>
        </Draggable>
    );
};

export default FetchingIndicator;
