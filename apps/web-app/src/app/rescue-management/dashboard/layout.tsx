import { SidebarProvider } from '@b-prism/shadcn-ui/index';
import SidebarWrapper from 'apps/web-app/src/components/sidebar-components/sidebar-wrapper';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <SidebarWrapper>{children}</SidebarWrapper>
        </SidebarProvider>
    );
}
