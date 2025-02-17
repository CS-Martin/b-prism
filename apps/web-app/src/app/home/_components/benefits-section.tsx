import React from 'react';
import { Shield, HeartHandshake, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@b-prism/shadcn-ui/index';

const BenefitsSection = () => {
    const benefits = [
        {
            title: 'Rapid Aid Deployment',
            description: 'Strategically positioned resources ensure help is delivered promptly, even during the most challenging situations.',
            icon: <Shield className='w-6 h-6 transition duration-300' />,
            highlightColor: 'text-blue-400',
            hoverClass: 'group-hover:text-blue-400',
        },
        {
            title: 'Rescue Made Easier',
            description: 'Quickly locate and assist stranded individuals during disasters with an integrated platform designed to streamline rescue operations.',
            icon: <HeartHandshake className='w-6 h-6 transition duration-300' />,
            highlightColor: 'text-red-400',
            hoverClass: 'group-hover:text-red-400',
        },
        {
            title: 'Smarter Resource Use',
            description: 'Optimize supplies and prioritize critical needs to create a bigger impact where it matters most.',
            icon: <Lightbulb className='w-6 h-6 transition duration-300' />,
            highlightColor: 'text-yellow-400',
            hoverClass: 'group-hover:text-yellow-400',
        },
    ];

    return (
        <div className='text-white py-12'>
            <div className='mx-auto sm:px-6 xl:px-[150px] 2xl:px-[350px]'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 px-5 md:gap-8'>
                    {benefits.map((benefit, index) => (
                        <Card
                            key={index}
                            className={`bg-transparent border group cursor-default transition duration-300`}
                            data-aos='fade-up'>
                            <CardContent className='flex flex-col items-start text-left p-6'>
                                {/* Icon with dynamic hover color */}
                                <div className={`mb-4 ${benefit.hoverClass}`}>
                                    {React.cloneElement(benefit.icon, {
                                        className: `${benefit.icon.props.className} ${benefit.hoverClass}`,
                                    })}
                                </div>
                                {/* Title with dynamic hover color */}
                                <h3 className={`text-xl font-semibold mb-2 transition duration-300 ${benefit.hoverClass}`}>{benefit.title}</h3>
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
