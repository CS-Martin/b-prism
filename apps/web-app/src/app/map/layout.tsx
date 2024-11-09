import { SidebarProvider } from '@b-prism/shadcn-ui/index';

export default function MapLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <main className='overflow-hidden'>{children}</main>
        </SidebarProvider>
    );
}
