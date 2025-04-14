import { AOSInit } from '@b-prism/shadcn-ui/index';
import { Inter } from 'next/font/google';
import HomeNavbar from '../../components/home-navbar';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-montserrat',
    weight: ['400', '500', '600', '700'],
});

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className={`${inter.variable} font-sans`}>
            <AOSInit />
            <HomeNavbar />
            {children}
        </main>
    );
}
