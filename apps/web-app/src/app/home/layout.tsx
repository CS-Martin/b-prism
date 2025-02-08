import Navbar from '../../components/navbar';
import { Inter, Montserrat } from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-montserrat',
    weight: ['400', '500', '600', '700'],
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className={`${inter.variable} font-sans`}>
            <Navbar />
            {children}
        </main>
    );
}
