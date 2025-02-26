import { Label, Separator } from '@b-prism/shadcn-ui/index';
import { Locate, ShieldAlert } from 'lucide-react';
import { CollapsibleSection } from './collapsible-section';
import { formatDistanceToNow } from 'date-fns';

export const RescuePostCard = ({ post, onLocate }: { post: any; onLocate: (post: any) => void }) => (
    <div className='bg-sidebar p-3 rounded-[5px]'>
        <div className='flex justify-between items-center gap-2'>
            <span className='flex items-center gap-2'>
                <ShieldAlert
                    size={22}
                    className='bg-red-500 text-white rounded-full p-[3px]'
                />
                <p className='font-semibold'>
                    {new Date(post.created_at).toLocaleDateString()} <span className='text-xs text-gray-400'>| {formatDistanceToNow(new Date(post.created_at))} ago</span>
                </p>
            </span>
            <button onClick={() => onLocate(post)}>
                <Locate size={18} />
            </button>
        </div>
        <Separator className='my-4 bg-opacity-20 w-full' />
        <div className='flex flex-col gap-2'>
            <CollapsibleSection title='Contact Person/s'>
                {post.contact_persons.map((contact: any, index: number) => (
                    <div
                        key={index}
                        className='flex flex-col gap-1'>
                        <Label>
                            <span className='font-semibold text-[#F4AA55]'>Name: </span>
                            {contact.name}
                        </Label>
                        <Label>
                            <span className='font-semibold text-[#F4AA55]'>Contact: </span>
                            {contact.contact}
                        </Label>
                    </div>
                ))}
            </CollapsibleSection>
            <CollapsibleSection title='Demographics'>
                <Label>
                    <span className='font-semibold text-[#F4AA55]'>Adult: </span>
                    {post.total_adults}
                </Label>
                <Label>
                    <span className='font-semibold text-[#F4AA55]'>Child: </span>
                    {post.total_children}
                </Label>
                <Label>
                    <span className='font-semibold text-[#F4AA55]'>Elderly: </span>
                    {post.total_elderly}
                </Label>
            </CollapsibleSection>
            <Label>
                <span className='font-semibold text-[#F4AA55]'>Address: </span>
                {post.address}
            </Label>
            <Label>
                <span className='font-semibold text-[#F4AA55]'>Landmark: </span>
                {post.landmark}
            </Label>
        </div>
    </div>
);
