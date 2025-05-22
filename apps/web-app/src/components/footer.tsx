import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Mail, Phone, Github, AlertTriangle, Package, Map, Facebook, Linkedin, Mailbox } from 'lucide-react';

export const HaribonFooter = ({ className }: { className: string }) => {
    return (
        <footer className={`${className}`}>
            <div className='container max-w-6xl px-3 pb-10 mx-auto md:px-0 pt-14'>
                <div className='grid grid-cols-1 gap-8 py-4 md:grid-cols-4'>
                    <div className='space-y-3'>
                        <div className='flex items-center space-x-2'>
                            <Link
                                href={'/home'}
                                className='flex items-center gap-3 font-bold'>
                                <Image
                                    src={'/logo/haribon-logo-blue.svg'}
                                    height={40}
                                    width={40}
                                    alt='haribon logo'
                                />
                                <p className='font-bold leading-tight'>
                                    PROJECT <br />
                                    HARIBON
                                </p>
                            </Link>
                        </div>
                        <p className='text-sm text-muted-foreground'>Hazard Assessment and Rescue Integration for Bicol Operations Network</p>
                        <p className='text-sm text-muted-foreground'>Enhancing disaster response through real-time data, AI processing, and interactive mapping.</p>
                    </div>

                    <div className='space-y-3'>
                        <h3 className='text-sm font-medium'>Features</h3>
                        <ul className='space-y-5'>
                            <li>
                                <Link
                                    href='/map'
                                    className='flex items-center gap-2 text-sm text-muted-foreground hover:underline'>
                                    <Map className='w-4 h-4' />
                                    <span>Hazard Assessment</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/map'
                                    className='flex items-center gap-2 text-sm text-muted-foreground hover:underline'>
                                    <AlertTriangle className='w-4 h-4' />
                                    <span>Rescue Requests</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/map'
                                    className='flex items-center gap-2 text-sm text-muted-foreground hover:underline'>
                                    <Map className='w-4 h-4' />
                                    <span>Route Optimization</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/map'
                                    className='flex items-center gap-2 text-sm text-muted-foreground hover:underline'>
                                    <Package className='w-4 h-4' />
                                    <span>Warehouse Management</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className='space-y-3'>
                        <h3 className='text-sm font-medium'>Resources</h3>
                        <ul className='space-y-5'>
                            <li>
                                <Link
                                    href='#'
                                    className='text-sm text-muted-foreground hover:underline'>
                                    Documentation
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href='/https://github.com/CS-Martin/b-prism'
                                    className='text-sm text-muted-foreground hover:underline'>
                                    Github Repository
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/https://github.com/CS-Martin/b-prism/issues'
                                    className='text-sm text-muted-foreground hover:underline'>
                                    Submit an Issue
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/https://www2.naga.gov.ph/emergency-hotline/'
                                    className='text-sm text-muted-foreground hover:underline'>
                                    Emergency Contacts
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className='space-y-3'>
                        <h3 className='text-sm font-medium'>Contact</h3>
                        <div className='flex flex-col gap-y-4'>
                            <div className='flex items-start gap-2'>
                                <Mail
                                    size={18}
                                    className='text-muted-foreground'
                                />
                                <span className='text-muted-foreground'>projectharibon@gmail.com</span>
                            </div>
                            <div className='flex items-start gap-2'>
                                <Phone
                                    size={18}
                                    className='text-muted-foreground'
                                />
                                <span className='text-muted-foreground'>(+63) 928 714 9344</span>
                            </div>
                            <div className='flex items-start gap-2'>
                                <MapPin
                                    size={18}
                                    className='text-muted-foreground'
                                />
                                <address className='not-italic text-muted-foreground'>
                                    Ateneo de Naga University <br />
                                    Bagumbayan Sur, Naga City, 4400
                                </address>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col items-center justify-between gap-4 pt-6 mt-8 border-t md:flex-row'>
                    <p className='text-xs text-muted-foreground'>&copy; {new Date().getFullYear()} HARIBON. All rights reserved.</p>
                    <div className='flex items-center gap-4'>
                        <Link
                            href='/privacy-policy'
                            className='text-xs text-muted-foreground hover:underline'>
                            Privacy Policy
                        </Link>
                        <Link
                            href='/terms-of-service'
                            className='text-xs text-muted-foreground hover:underline'>
                            Terms of Service
                        </Link>
                        <Link
                            href='/accessibility'
                            className='text-xs text-muted-foreground hover:underline'>
                            Accessibility
                        </Link>
                    </div>
                    <div className='flex items-center space-x-2.5 transition-all duration-300'>
                        <Link
                            href={'https://www.facebook.com/ProjectHaribonV'}
                            className='p-1 transition-all duration-300 rounded hover:bg-blue-200 '>
                            <Facebook
                                size={18}
                                className='text-muted-foreground hover:text-blue-500'
                            />
                        </Link>

                        <Link
                            href={'https://www.linkedin.com/in/cs-martiin/'}
                            className='p-1 transition-all duration-300 rounded hover:bg-blue-200 hover:text-blue-500'>
                            <Linkedin
                                size={18}
                                className='text-muted-foreground hover:text-blue-500'
                            />
                        </Link>

                        <Link
                            href={'https://github.com/CS-Martin/b-prism/'}
                            className='p-1 transition-all duration-300 rounded hover:bg-gray-300 '>
                            <Github
                                size={18}
                                className='text-muted-foreground hover:text-gray-700'
                            />
                        </Link>

                        <Link
                            href='mailto:projectharibon@gmail.com'
                            className='p-1 transition-all duration-300 rounded hover:bg-red-200 '>
                            <Mailbox
                                size={18}
                                className='text-muted-foreground hover:text-red-500'
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
