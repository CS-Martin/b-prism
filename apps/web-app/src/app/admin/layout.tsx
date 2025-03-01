import { SidebarProvider } from '@b-prism/shadcn-ui/index';
import SidebarWrapper from '../../components/sidebar-components/sidebar-wrapper';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <SidebarWrapper>{children}</SidebarWrapper>
        </SidebarProvider>
    );
}
