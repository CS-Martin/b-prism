import Navbar from '../../components/navbar';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className={`${montserrat.variable} font-sans`}>
            <Navbar />
            {children}
        </main>
    );
}
