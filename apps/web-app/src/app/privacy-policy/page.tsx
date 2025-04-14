import { Metadata } from 'next';
import { HaribonPolicy } from './_components/haribon-policy';
import { useTheme } from 'next-themes';
import { MessengerBotPolicy } from './_components/messenger-bot-policy';
import { Card, CardDescription, CardHeader, Label } from '@b-prism/shadcn-ui/index';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Navbar } from '../../components/navbar';
import { useSession } from 'next-auth/react';
import { HaribonFooter } from '../../components/footer';

export const metadata: Metadata = {
    title: 'Privacy Policy | Project HARIBON',
    description: 'Privacy Policy for Project HARIBON - Hazard Assessment and Rescue Integration for Bicol Operations Network',
};

export default function PrivacyPolicyPage() {
    return (
        <main className='min-h-screen'>
            <Navbar />

            <div className='container max-w-6xl py-16 mx-auto mt-[25%] md:mt-[5%] px-2 md:px-0'>
                <HaribonPolicy />
                <MessengerBotPolicy />

                <Card className='pb-5 mt-5'>
                    <CardHeader>
                        <h3 className='font-semibold md:text-xl'>Contact Us</h3>
                        <p className='leading-relaxed '>If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us at:</p>
                    </CardHeader>
                    <CardDescription className='px-3 md:px-5'>
                        <div className='flex flex-col gap-3 p-3 border rounded'>
                            <div className='flex flex-row items-center gap-2'>
                                <div className='p-1.5 rounded w-fit bg-blue-200'>
                                    <Mail className='w-4 h-4 text-blue-500 md:w-5 md:h-5' />
                                </div>
                                <p className='font-semibold text-black'>projectharibon@gmail.com</p>
                            </div>

                            <div className='flex flex-row items-center gap-2'>
                                <div className='p-1.5 rounded w-fit bg-blue-200'>
                                    <Phone className='w-4 h-4 text-blue-500 md:w-5 md:h-5' />
                                </div>
                                <p className='font-semibold text-black'>(+63) 917 123 4567</p>
                            </div>

                            <div className='flex flex-row items-center gap-2'>
                                <div className='p-1.5 rounded w-fit bg-blue-200'>
                                    <MapPin className='w-4 h-4 text-blue-500 md:w-5 md:h-5' />
                                </div>
                                <p className='font-semibold text-black'>Ateneo de Naga University, Bagumbayan Sur, Naga City, 4400</p>
                            </div>
                        </div>
                    </CardDescription>
                </Card>

                <Card className='mt-5 bg-blue-200'>
                    <CardHeader>
                        <h3 className='md:text-[16px] text-sm italic'>
                            By using the Project HARIBON system, you consent to the collection and use of your data as outlined in this Privacy Policy.
                        </h3>
                    </CardHeader>
                </Card>
            </div>

            <HaribonFooter className={'bg-sidebar border-t'} />
        </main>
    );
}
