import { ThemeProvider, Toaster } from '@b-prism/shadcn-ui/index';
import SessionComponentProvider from '../context/session-provider';
import './global.css';

export const metadata = {
    title: 'B-Prism',
    description: 'B-Prism',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en'>
            <body className=''>
                <SessionComponentProvider>
                    <ThemeProvider
                        attribute='class'
                        defaultTheme='system'
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </SessionComponentProvider>
            </body>
        </html>
    );
}
