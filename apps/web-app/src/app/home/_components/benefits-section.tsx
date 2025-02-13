import React from 'react';
import { Shield, Signal, HeartHandshake, Lightbulb, BusFront } from 'lucide-react';
import { Card, CardContent } from '@b-prism/shadcn-ui/index';

const BenefitsSection = () => {
    const benefits = [
        {
            title: 'Rapid Aid Deployment',
            description: 'Strategically positioned resources ensure help is delivered promptly, even during the most challenging situations.',
            icon: <Shield className='w-6 h-6 text-white' />,
        },
        {
            title: 'Rescue Made Easier',
            description: 'Quickly locate and assist stranded individuals during disasters with an integrated platform designed to streamline rescue operations.',
            icon: <HeartHandshake className='w-6 h-6 text-white' />,
        },
        {
            title: 'Smarter Resource Use',
            description: 'Optimize supplies and prioritize critical needs to create a bigger impact where it matters most.',
            icon: <Lightbulb className='w-6 h-6 text-white' />,
        },
        // {
        //     title: 'Enhanced Road Awareness',
        //     description: 'Optimize supplies and prioritize critical needs to create a bigger impact where it matters most.',
        //     icon: <BusFront className='w-6 h-6 text-white' />,
        // },
    ];

    return (
        <div className=' text-white py-12'>
            <div className=' mx-auto sm:px-6 lg:px-[350px]'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    {benefits.map((benefit, index) => (
                        <Card
                            key={index}
                            className='bg-transparent border'
                            data-aos='fade-up'>
                            <CardContent className='flex flex-col items-start text-left p-6'>
                                <div className='mb-4'>{benefit.icon}</div>
                                <h3 className='text-xl font-semibold mb-2'>{benefit.title}</h3>
                                <p className='text-gray-400'>{benefit.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BenefitsSection;
