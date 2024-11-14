import { SidebarProvider, SidebarTrigger } from '@b-prism/shadcn-ui/index';

export default function MapLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <main className='overflow-hidden'>
                {children}
                <SidebarTrigger className='z-50 p-5' />
            </main>
        </SidebarProvider>
    );
}
