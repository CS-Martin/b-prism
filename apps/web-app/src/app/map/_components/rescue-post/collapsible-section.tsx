import { Collapsible, CollapsibleContent, CollapsibleTrigger, Label, Separator } from '@b-prism/shadcn-ui/index';
import { ChevronRight } from 'lucide-react';

export const CollapsibleSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Collapsible className='group/collapsible'>
        <CollapsibleTrigger className='w-full'>
            <div className='flex items-center justify-between w-full hover:underline group/label'>
                <Label className='font-semibold text-[#F4AA55]'>{title}</Label>
                <ChevronRight
                    size={18}
                    className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90'
                />
            </div>
        </CollapsibleTrigger>
        <CollapsibleContent className='flex flex-col gap-2 mt-1 px-5 relative'>
            <Separator
                orientation='vertical'
                className='absolute top-0 left-2 h-full w-[1px] bg-opacity-20'
            />
            {children}
        </CollapsibleContent>
    </Collapsible>
);
