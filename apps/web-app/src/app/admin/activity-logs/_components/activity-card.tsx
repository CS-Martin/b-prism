import { Avatar, AvatarImage, AvatarFallback } from '@b-prism/shadcn-ui/index';
import { ActivityLogDto } from '@dto';
import { format, formatDistanceToNow } from 'date-fns';

export default function ActivityCard(log: ActivityLogDto) {
    return (
        <div className='ml-6 prism-card-hover w-full h-fit min-h-[115px] max-h-[135px] px-3 py-2 rounded-md cursor-pointer'>
            <p className='text-[12px] text-[#a1a1aa]'>
                {format(new Date(log.timestamp), 'MMMM d, yyyy')} | {formatDistanceToNow(new Date(log.timestamp))} ago
            </p>
            <p className='py-2'>{log.description}</p>

            <div className='flex flex-row items-center gap-2 text-[12px] text-[#a1a1aa]'>
                <Avatar className='rounded-full h-6 w-6'>
                    <AvatarImage src='https://github.com/shadcn.png' />
                    <AvatarFallback>US</AvatarFallback>
                </Avatar>
                {log.author}
            </div>
        </div>
    );
}
