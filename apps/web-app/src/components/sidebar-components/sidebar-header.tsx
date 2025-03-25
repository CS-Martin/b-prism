import { SidebarHeader, SidebarMenuButton, useSidebar } from '@b-prism/shadcn-ui/index';
import { Bell } from 'lucide-react';
import Image from 'next/image';

export const SidebarHeaderComponent = () => {
    const { state } = useSidebar();

    return (
        <SidebarHeader className={`${state === 'collapsed' ? 'mt-3' : 'p-4'}  border-b`}>
            <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent p-0 data-[state=open]:text-sidebar-accent-foreground'>
                {/* className={`transition-all duration-300 ease-in-out bg-blue-600 rounded-sm flex items-center justify-center ${state === 'collapsed' ? '' : 'h-10 w-10'}`}> */}
                <div className='flex items-center justify-center bg-blue-600 rounded-lg shadow-xl size-11 text-sidebar-primary-foreground'>
                    <Image
                        src={'/logo/haribon-logo.svg'}
                        height={24}
                        width={24}
                        alt='haribon logo'
                        className={`${state === 'collapsed' ? 'size-6' : 'size-7'}`}
                    />
                </div>
                <div className={`grid flex-1 text-left text-sm leading-relaxed ${state === 'collapsed' ? 'hidden' : 'block'}`}>
                    <span className='text-xs truncate'>Project</span>
                    <span className='font-bold truncate'>HARIBON</span>
                </div>
                <Bell
                    size={24}
                    className={`${state === 'collapsed' ? 'hidden' : 'block'}`}
                />
            </SidebarMenuButton>
        </SidebarHeader>
    );
};
