import { Checkbox, Label, Separator } from '@b-prism/shadcn-ui/index';
import Image from 'next/image';

interface ControlPanelProps {
    visibility: {
        warehouses: boolean;
        dispensingPoints: boolean;
    };
    onVisibilityChange: (layer: string, isVisible: boolean) => void;
}

function ControlPanel({ visibility, onVisibilityChange }: ControlPanelProps) {
    return (
        <div className='absolute top-0 right-0 z-50 max-w-[300px] bg-sidebar-accent rounded-[10px] shadow-xl m-[20px] outline-none'>
            <div className='flex flex-col gap-1 mb-4 px-5 pt-3.5'>
                <Label className='text-lg font-semibold'>Dynamic Layer Control</Label>
                <p className='text-sm text-white/50'>Dynamically control the visibility of layers on the map</p>
            </div>

            <Separator className='my-4 bg-white/40 w-full' />

            <div className='px-5 pb-3.5'>
                <div className='flex items-center gap-2 mb-3'>
                    <Checkbox
                        checked={visibility.warehouses}
                        onCheckedChange={(evt) => onVisibilityChange('warehouses', evt as boolean)}
                    />
                    <span className='flex items-center gap-2'>
                        <Image
                            src='/icons/warehouse.icon.svg'
                            alt='warehouse'
                            width={20}
                            height={20}
                        />
                        <Label className='font-normal uppercase'>Warehouses</Label>
                    </span>
                </div>

                <div className='flex items-center gap-2 mb-3'>
                    <Checkbox
                        checked={visibility.dispensingPoints}
                        onCheckedChange={(evt) => onVisibilityChange('dispensingPoints', evt as boolean)}
                    />
                    <span className='flex items-center gap-2'>
                        <Image
                            src='/icons/dispensing-point.icon.svg'
                            alt='dispensing point'
                            width={20}
                            height={20}
                        />
                        <Label className='font-normal uppercase'>Dispensing Points</Label>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ControlPanel;
