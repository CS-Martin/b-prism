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
                className={`absolute drag-handle bottom-0 text-[14px] cursor-move p-1.5 z-50 prisma-card-bg md:w-fit flex flex-row items-center gap-3 rounded-ss-lg ${state === 'collapsed' ? 'left-20' : 'left-[19rem]'}`}>
                <Terminal className='h-4 w-4' />

                <div className='flex flex-row gap-x-2 items-center'>
                    {isFetchingWarehouses ? (
                        <>
                            <Loader2 className='h-5 w-5 animate-spin text-yellow-500' />
                            <small className='text-yellow-500'>Loading warehouses. Please wait.</small>
                        </>
                    ) : (
                        <>
                            <House className='h-3.5 w-3.5' />
                            <small className='text-white'>Warehouses ready.</small>
                        </>
                    )}
                </div>

                <div className='flex flex-row gap-x-2 items-center'>
                    {isFetchingDispensingPoints ? (
                        <>
                            <Loader2 className='h-5 w-5 animate-spin text-yellow-500' />
                            <small className='text-yellow-500'>Loading warehouses. Please wait.</small>
                        </>
                    ) : (
                        <>
                            <MapPin className='h-3.5 w-3.5' />
                            <small className='text-white'>Warehouses ready.</small>
                        </>
                    )}
                </div>

                <div className='flex flex-row gap-x-2'>
                    {isFetchingRoadNetwork ? (
                        <>
                            <Loader2 className='h-5 w-5 animate-spin text-yellow-500' />
                            <small className='text-yellow-500'>Loading road data. Please wait.</small>
                        </>
                    ) : (
                        <>
                            <Image
                                src={'/icons/road.svg'}
                                height={20}
                                width={20}
                                alt='road icon'
                            />
                            <small className='text-white'>Road network ready.</small>
                        </>
                    )}
                </div>
            </div>
        </Draggable>
    );
};

export default FetchingIndicator;
