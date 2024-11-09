import { AppSidebar, SidebarProvider, SidebarTrigger, SidebarFooter } from '@b-prism/shadcn-ui/index';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <main>{children}</main>
        </SidebarProvider>
    );
}
