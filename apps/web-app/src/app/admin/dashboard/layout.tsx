import { AppSidebar, SidebarProvider, SidebarTrigger, SidebarFooter } from '@b-prism/shadcn-ui/index';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main>
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    );
}
