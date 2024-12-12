import { Checkbox, Label, Separator } from '@b-prism/shadcn-ui/index';
import Image from 'next/image';
import { useState } from 'react';
import { ChevronUp, ChevronDown, PanelRight, PanelLeft } from 'lucide-react';

interface ControlPanelProps {
    visibility: {
        warehouses: boolean;
        dispensingPoints: boolean;
    };
    onVisibilityChange: (layer: string, isVisible: boolean) => void;
}

function ControlPanel({ visibility, onVisibilityChange }: ControlPanelProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className='absolute top-0 right-0 z-50 max-w-[300px] bg-sidebar-accent rounded-[10px] shadow-xl m-[20px] outline-none'>
            <div
                className={`flex items-center justify-between cursor-pointer transition-all duration-300 ${isExpanded ? 'px-5 pt-3.5 mb-3' : 'p-3'}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <Label className={`text-lg font-semibold ${isExpanded ? '' : 'hidden'}`}>Dynamic Layer Control</Label>
                {isExpanded ? <PanelRight size={18} /> : <PanelLeft size={18} />}
            </div>

            {isExpanded && (
                <>
                    <div className='px-5'>
                        <p className='text-sm text-gray-400'>Dynamically control the visibility of layers on the map</p>
                    </div>

                    <Separator className='my-4 bg-gray-500 w-full' />

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
                </>
            )}
        </div>
    );
}

export default ControlPanel;
