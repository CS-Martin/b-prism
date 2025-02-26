import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@b-prism/shadcn-ui/index';
import { DiamondPlus, Pencil, Trash2 } from 'lucide-react';

export default function ActionIcon(action: string) {
    switch (action) {
        case 'CREATE':
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className='w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center z-10 cursor-pointer '>
                                <DiamondPlus size={18} />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Create</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        case 'UPDATE':
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className='w-7 h-7 bg-orange-400 text-white rounded-full flex items-center justify-center z-10 cursor-pointer'>
                                <Pencil size={18} />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Update</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        case 'DELETE':
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className='w-7 h-7 bg-red-400 text-white rounded-full flex items-center justify-center z-10 cursor-pointer'>
                                <Trash2 size={18} />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Delete</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        default:
            return null;
    }
}
