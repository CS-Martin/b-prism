import { AppSidebar, SidebarProvider, SidebarTrigger } from '@b-prism/shadcn-ui/index';

export default function MapLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className='overflow-hidden'>
                <SidebarTrigger className='z-50' />
                {children}
            </main>
        </SidebarProvider>
    );
}
