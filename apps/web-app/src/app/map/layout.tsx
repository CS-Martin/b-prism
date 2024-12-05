import { SidebarProvider, SidebarTrigger } from '@b-prism/shadcn-ui/index';

export default function MapLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <main className=''>{children}</main>
            <SidebarTrigger className='z-50 mt-2 text-white' />
        </SidebarProvider>
    );
}
