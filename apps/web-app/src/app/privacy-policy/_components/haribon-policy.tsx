'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Card, CardContent, CardHeader } from '@b-prism/shadcn-ui/index';
import { Database, MapPin, MonitorSmartphone, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export const HaribonPolicy = () => {
    const { setTheme } = useTheme();

    useEffect(() => {
        setTheme('light');
    }, [setTheme]);

    return (
        <>
            <div className='text-center'>
                <h1 className='mb-4 text-xl font-bold md:text-3xl bg-clip-text'>Privacy Policy</h1>
                <p className='leading-7'>
                    This privacy policy describes how Project Haribon collects, uses, and protects your information when you use our platform and services. Please read this privacy
                    policy carefully. By using our services, you consent to the practices described in this policy.
                </p>
            </div>

            <div className='mt-5'>
                <h3 className='p-5 font-bold text-white bg-blue-500 rounded-t-lg md:text-xl'>Privacy Policy for Project HARIBON</h3>
                <Accordion
                    type='multiple'
                    defaultValue={[
                        'haribon-policy',
                        'informations-we-collect',
                        'how-we-use-your-information',
                        'data-security',
                        'data-retention',
                        'your-rights',
                        'changes-to-this-privacy-policy',
                    ]}
                    className='flex flex-col w-full border'>
                    <AccordionItem
                        value='haribon-policy'
                        className='px-3 md:px-5 bg-sidebar'>
                        <AccordionTrigger className='font-semibold text-md md:text-xl'>Introduction</AccordionTrigger>
                        <AccordionContent className='flex flex-col gap-y-5'>
                            <p className='mb-3 leading-relaxed '>
                                Project HARIBON (Hazard Assessment and Rescue Integration for Bicol Operations Network) is committed to protecting your privacy and ensuring the
                                security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you use our disaster
                                response and logistics management system.
                            </p>
                            <p className='leading-relaxed '>By using Project HARIBON, you consent to the data practices described in this policy.</p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                        value='informations-we-collect'
                        className='px-2 md:px-5 bg-sidebar'>
                        <AccordionTrigger className='font-semibold text-md md:text-xl'>Information We Collect</AccordionTrigger>

                        <AccordionContent className='flex flex-col gap-y-5'>
                            <p className='leading-relaxed '>We may use the information we collect for the following purposes:</p>

                            <div className='grid gap-4 md:grid-cols-2'>
                                <Card>
                                    <CardHeader className='relative flex flex-col pb-3'>
                                        <span className='flex flex-row items-center gap-3'>
                                            <div className='p-1.5 bg-blue-200  rounded w-fit'>
                                                <User className='w-4 h-4 text-blue-500 md:w-5 md:h-5' />
                                            </div>
                                            <p className='font-bold md:text-lg '>Personal Information</p>
                                        </span>
                                    </CardHeader>
                                    <CardContent>Name, contact information, location data, and other details necessary for rescue operations and disaster response.</CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className='relative flex flex-col pb-3'>
                                        <span className='flex flex-row items-center gap-3'>
                                            <div className='p-1.5 bg-blue-200  rounded w-fit'>
                                                <Database className='w-4 h-4 text-blue-500 md:w-5 md:h-5' />
                                            </div>
                                            <p className='font-bold md:text-lg'>Usage Data</p>
                                        </span>
                                    </CardHeader>
                                    <CardContent>Information about how you interact with our system, including access times, pages viewed, and system features used.</CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className='relative flex flex-col pb-3'>
                                        <span className='flex flex-row items-center gap-3'>
                                            <div className='p-1.5 bg-blue-200  rounded w-fit'>
                                                <MonitorSmartphone className='w-4 h-4 text-blue-500 md:w-5 md:h-5' />
                                            </div>
                                            <p className='font-bold md:text-lg'>Device Information</p>
                                        </span>
                                    </CardHeader>
                                    <CardContent>
                                        Information about the devices you use to access our system, including hardware models, operating systems, and mobile network information.
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className='relative flex flex-col pb-3'>
                                        <span className='flex flex-row items-center gap-3'>
                                            <div className='p-1.5 bg-blue-200  rounded w-fit'>
                                                <MapPin className='w-4 h-4 text-blue-500 md:w-5 md:h-5' />
                                            </div>
                                            <p className='font-bold md:text-lg'>Location Data</p>
                                        </span>
                                    </CardHeader>
                                    <CardContent>
                                        With your consent, we collect precise location data to facilitate rescue operations and provide location-based services.
                                    </CardContent>
                                </Card>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                        value='how-we-use-your-information'
                        className='px-5 bg-sidebar'>
                        <AccordionTrigger className='font-semibold md:text-xl'>How we use your information</AccordionTrigger>
                        <AccordionContent className='flex flex-col gap-y-5'>
                            <div>
                                <p className='mb-3 leading-relaxed text-gray-700'>We use the collected information for the following purposes:</p>
                                <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                                    <div className='p-4 rounded-lg bg-gray-50'>
                                        <p className='text-gray-700'>To provide and maintain our disaster response and logistics management services</p>
                                    </div>
                                    <div className='p-4 rounded-lg bg-gray-50'>
                                        <p className='text-gray-700'>To coordinate rescue operations and emergency response</p>
                                    </div>
                                    <div className='p-4 rounded-lg bg-gray-50'>
                                        <p className='text-gray-700'>To optimize resource distribution and logistics planning</p>
                                    </div>
                                    <div className='p-4 rounded-lg bg-gray-50'>
                                        <p className='text-gray-700'>To improve and enhance our system&apos;s functionality and user experience</p>
                                    </div>
                                    <div className='p-4 rounded-lg bg-gray-50'>
                                        <p className='text-gray-700'>To analyze usage patterns and system performance</p>
                                    </div>
                                    <div className='p-4 rounded-lg bg-gray-50'>
                                        <p className='text-gray-700'>To communicate with you regarding emergency situations and system updates</p>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                        value='data-security'
                        className='px-5 bg-sidebar'>
                        <AccordionTrigger className='font-semibold md:text-xl'>Data Security</AccordionTrigger>
                        <AccordionContent className='flex flex-col gap-y-5'>
                            <p className='mb-3 leading-relaxed '>
                                We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure,
                                alteration, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee
                                absolute security.
                            </p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                        value='data-retention'
                        className='px-5 bg-sidebar'>
                        <AccordionTrigger className='font-semibold md:text-xl'>Data Retention</AccordionTrigger>
                        <AccordionContent className='flex flex-col gap-y-5'>
                            <p className='mb-3 leading-relaxed '>
                                {' '}
                                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention
                                period is required or permitted by law. We will securely delete or anonymize your information when it is no longer needed for these purposes.
                            </p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                        value='your-rights'
                        className='px-5 bg-sidebar'>
                        <AccordionTrigger className='font-semibold md:text-xl'>Your Rights</AccordionTrigger>
                        <AccordionContent className='flex flex-col gap-y-5'>
                            <p className='leading-relaxed '>
                                {' '}
                                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention
                                period is required or permitted by law. We will securely delete or anonymize your information when it is no longer needed for these purposes.
                            </p>

                            <div>
                                <p className='mb-3 leading-relaxed text-gray-700'>
                                    Depending on your location, you may have certain rights regarding your personal information, including:
                                </p>
                                <div className='p-5 rounded-lg bg-gray-50'>
                                    <ul className='space-y-2'>
                                        <li className='flex items-start'>
                                            <span className='w-2 h-2 my-auto mr-2 bg-blue-500 rounded-full'></span>
                                            <span className='text-gray-700'>The right to access and receive a copy of your personal information</span>
                                        </li>
                                        <li className='flex items-start'>
                                            <span className='w-2 h-2 my-auto mr-2 bg-blue-500 rounded-full'></span>
                                            <span className='text-gray-700'>The right to rectify or update your personal information</span>
                                        </li>
                                        <li className='flex items-start'>
                                            <span className='w-2 h-2 my-auto mr-2 bg-blue-500 rounded-full'></span>
                                            <span className='text-gray-700'>The right to request deletion of your personal information</span>
                                        </li>
                                        <li className='flex items-start'>
                                            <span className='w-2 h-2 my-auto mr-2 bg-blue-500 rounded-full '></span>
                                            <span className='text-gray-700'>The right to restrict or object to processing of your personal information</span>
                                        </li>
                                        <li className='flex items-start'>
                                            <span className='w-2 h-2 my-auto mr-2 bg-blue-500 rounded-full '></span>
                                            <span className='text-gray-700'>The right to data portability</span>
                                        </li>
                                        <li className='flex items-start'>
                                            <span className='w-2 h-2 my-auto mr-2 bg-blue-500 rounded-full'></span>
                                            <span className='text-gray-700'>The right to withdraw consent</span>
                                        </li>
                                    </ul>
                                </div>
                                <p className='mt-3 leading-relaxed text-gray-700'>
                                    To exercise these rights, please contact us using the information provided in the &quot;Contact Us&quot; section.
                                </p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                        value='changes-to-this-privacy-policy'
                        className='px-5 bg-sidebar'>
                        <AccordionTrigger className='font-semibold md:text-xl'>Changes to this Privacy Policy</AccordionTrigger>
                        <AccordionContent className='flex flex-col gap-y-5'>
                            <p className='mb-3 leading-relaxed '>
                                We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We
                                will notify you of any material changes by posting the updated Privacy Policy on our website and updating the &apos;Effective Date&apos; at the top
                                of this policy.
                            </p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </>
    );
};
