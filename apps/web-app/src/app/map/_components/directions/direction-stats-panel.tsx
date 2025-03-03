import { Input } from '@b-prism/shadcn-ui/index';

export const DirectionPanel = ({ start, destination }: { start: [number, number] | null; destination: [number, number] | null }) => {
    const formatCoord = (coord: number) => coord.toFixed(6);

    return (
        <div className='p-4 bg-white shadow-lg rounded-lg max-w-[20rem]'>
            <div className='mb-2'>
                <label className='block text-sm font-medium'>Start Coordinates</label>
                <Input
                    type='text'
                    value={start ? `${formatCoord(start[0])}, ${formatCoord(start[1])}` : ''}
                    readOnly
                />
            </div>
            <div>
                <label className='block text-sm font-medium'>Destination Coordinates</label>
                <Input
                    type='text'
                    value={destination ? `${formatCoord(destination[0])}, ${formatCoord(destination[1])}` : ''}
                    readOnly
                />
            </div>
        </div>
    );
};
