import { DiamondPlus, Pencil, Trash2 } from 'lucide-react';

export default function ActionIcon(action: string) {
    switch (action) {
        case 'CREATE':
            return (
                <div className='w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center z-10'>
                    <DiamondPlus size={18} />
                </div>
            );
        case 'UPDATE':
            return (
                <div className='w-7 h-7 bg-orange-400 text-white rounded-full flex items-center justify-center z-10'>
                    <Pencil size={18} />
                </div>
            );
        case 'DELETE':
            return (
                <div className='w-7 h-7 bg-red-400 text-white rounded-full flex items-center justify-center z-10'>
                    <Trash2 size={18} />
                </div>
            );
        default:
            return null;
    }
}
