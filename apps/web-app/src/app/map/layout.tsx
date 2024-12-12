import { SidebarProvider, SidebarTrigger } from '@b-prism/shadcn-ui/index';

import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
});

export default function MapLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <main className={`${montserrat.variable} font-sans`}>{children}</main>
            <SidebarTrigger className='z-50 mt-2 text-white' />
        </SidebarProvider>
    );
}
