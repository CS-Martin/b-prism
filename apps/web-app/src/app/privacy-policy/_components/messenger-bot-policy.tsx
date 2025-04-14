import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Card, CardContent, CardHeader } from '@b-prism/shadcn-ui/index';
import { Ambulance, Database, MapPin, Zap } from 'lucide-react';

export const MessengerBotPolicy = () => {
    return (
        <>
            <div className='mt-5'>
                <div className='flex flex-col gap-3 p-5 bg-blue-500 rounded-t-lg'>
                    <h3 className='text-xl font-bold text-white bg-blue-500 '>Privacy Policy for Project HARIBON - Messenger Chatbot</h3>
                    <p className='text-white '>
                        Project HARIBON values your privacy and is committed to protecting the information you share with us. This Privacy Policy outlines how we collect, use,
                        store, and protect your data when you interact with our Messenger chatbot for rescue requests in the event of a disaster
                    </p>
                </div>
                <Accordion
                    type='multiple'
                    defaultValue={[
                        'information-we-collect',
                        'how-we-use-your-data',
                        'data-sharing-and-disclosure',
                        'data-security',
                        'data-retention',
                        'changes-to-this-privacy-policy',
                    ]}
                    className='flex flex-col w-full border'>
                    <AccordionItem
                        value='information-we-collect'
                        className='px-5 bg-sidebar'>
                        <AccordionTrigger className='text-xl font-semibold'>Information We Collect</AccordionTrigger>
                        <AccordionContent className='flex flex-col gap-y-5'>
                            <p className='leading-relaxed '>
                                When you interact with the Project HARIBON chatbot on Facebook Messenger, we may collect the following information to assist in disaster response
                                efforts:
                            </p>
                            <div className='grid gap-4 md:grid-cols-2'>
                                <Card>
                                    <CardHeader className='relative flex flex-col pb-3'>
                                        <span className='flex flex-row items-center gap-3'>
                                            <div className='p-1.5 bg-blue-200  rounded w-fit'>
                                                <Database className='w-5 h-5 text-blue-500' />
                                            </div>
                                            <p className='text-lg font-bold'>User Data</p>
                                        </span>
                                    </CardHeader>
                                    <CardContent>We collect information related to your rescue requests such as your name, contact details, and location.</CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className='relative flex flex-col pb-3'>
                                        <span className='flex flex-row items-center gap-3'>
                                            <div className='p-1.5 bg-blue-200  rounded w-fit'>
                                                <MapPin className='w-5 h-5 text-blue-500' />
                                            </div>
                                            <p className='text-lg font-bold'>Location Information</p>
                                        </span>
                                    </CardHeader>
                                    <CardContent>For the purpose of providing timely assistance, we may collect your location.</CardContent>
                                </Card>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                        value='how-we-use-your-data'
                        className='px-5 bg-sidebar'>
                        <AccordionTrigger className='text-xl font-semibold'>How We Use Your Data</AccordionTrigger>
                        <AccordionContent className='flex flex-col gap-y-5'>
                            <p className='leading-relaxed '>The data collected from you is used exclusively for the following purposes:</p>
                            <div className='grid gap-4 md:grid-cols-2'>
                                <Card>
                                    <CardHeader className='relative flex flex-col pb-3'>
                                        <span className='flex flex-row items-center gap-3'>
                                            <div className='p-1.5 bg-blue-200  rounded w-fit'>
                                                <Ambulance className='w-5 h-5 text-blue-500' />
                                            </div>
                                            <p className='text-lg font-bold'>Rescue Request Processing</p>
                                        </span>
                                    </CardHeader>
                                    <CardContent>To identify your location and the nature of your emergency, and to connect you with relevant disaster response teams.</CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className='relative flex flex-col pb-3'>
                                        <span className='flex flex-row items-center gap-3'>
                                            <div className='p-1.5 bg-blue-200  rounded w-fit'>
                                                <Zap className='w-5 h-5 text-blue-500' />
                                            </div>
                                            <p className='text-lg font-bold'>Disaster Response Coordination</p>
                                        </span>
                                    </CardHeader>
                                    <CardContent>To facilitate the rapid coordination of assistance, ensuring timely and accurate rescue efforts.</CardContent>
                                </Card>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                        value='data-sharing-and-disclosure'
                        className='px-5 bg-sidebar'>
                        <AccordionTrigger className='text-xl font-semibold'>Data Sharing And Disclosure</AccordionTrigger>
                        <AccordionContent className='flex flex-col gap-y-5'>
                            <p className='mb-3 leading-relaxed '>
                                We do not share, sell, or rent your personal information to third parties, except as required for disaster response or as permitted by law. Your
                                data may be shared with the relevant rescue teams, emergency responders, or other agencies as part of the disaster response efforts.
                            </p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                        value='data-security'
                        className='px-5 bg-sidebar'>
                        <AccordionTrigger className='text-xl font-semibold'>Data Security</AccordionTrigger>
                        <AccordionContent className='flex flex-col gap-y-5'>
                            <p className='mb-3 leading-relaxed '>
                                We take reasonable measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. This includes
                                securing data storage, using encryption where appropriate, and ensuring proper access controls are in place.
                            </p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                        value='data-retention'
                        className='px-5 bg-sidebar'>
                        <AccordionTrigger className='text-xl font-semibold'>Data Retention</AccordionTrigger>
                        <AccordionContent className='flex flex-col gap-y-5'>
                            <p className='mb-3 leading-relaxed '>
                                {' '}
                                We retain the data only for as long as necessary to complete your rescue request or for a duration required by applicable law or disaster management
                                procedures. Once the request has been fulfilled, data will be securely deleted.
                            </p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                        value='changes-to-this-privacy-policy'
                        className='px-5 bg-sidebar'>
                        <AccordionTrigger className='text-xl font-semibold'>Changes to this Privacy Policy</AccordionTrigger>
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
