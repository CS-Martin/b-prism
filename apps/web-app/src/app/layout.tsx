import { ThemeProvider, Toaster } from '@b-prism/shadcn-ui/index';
import SessionComponentProvider from '../context/session-provider';
import { NextStepProvider } from 'nextstepjs';
import './global.css';

export const metadata = {
    title: 'Project Haribon',
    description: 'Project Haribon',
};

// Add montserrat font
import { Montserrat } from 'next/font/google';
import { LoadingProgressProvider } from '../components/providers/bprogress-provider';

const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en'>
            <body className={`${montserrat.variable} font-sans`}>
                <SessionComponentProvider>
                    <LoadingProgressProvider>
                        <NextStepProvider>
                            <ThemeProvider
                                attribute='class'
                                defaultTheme='dark'
                                enableSystem
                                disableTransitionOnChange>
                                {children}
                                <Toaster />
                            </ThemeProvider>
                        </NextStepProvider>
                    </LoadingProgressProvider>
                </SessionComponentProvider>
            </body>
        </html>
    );
}
