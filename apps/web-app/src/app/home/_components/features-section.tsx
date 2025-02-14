import Image from 'next/image';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const FeaturesSection = () => {
    const features = [
        {
            title: 'Messenger Bot for Rescue Requests',
            subtitle: 'Real-time Communication',
            description:
                'Empowering individuals in need of rescue with a messenger bot. Users can report their location, which is automatically added to the system and displayed on the map for rescuers to act quickly.',
            image: '/img/map-img.png',
        },
        {
            title: 'Optimal Facility Location',
            subtitle: 'Multi-modal Analysis',
            description: 'Utilizes advanced algorithms to determine the best warehouse placements in the Bicol region, improving disaster response and resource distribution.',
            image: '/img/map-img.png',
        },
        {
            title: 'Typhoon Simulation',
            subtitle: 'Disaster Preparedness',
            description: 'Simulates typhoon scenarios to predict potential vulnerabilities in the network and ensures readiness for real-world disaster events.',
            image: '/img/map-img.png',
        },
        {
            title: 'Road Damage Network Simulation',
            subtitle: 'Infrastructure Resilience',
            description: 'Simulates road damage caused by natural disasters to analyze network disruptions and design efficient alternative routes for rescue and logistics.',
            image: '/img/map-img.png',
        },
        {
            title: 'Multi-Objective Optimization',
            subtitle: 'Balanced Decision-Making',
            description: 'Minimize delivery time, economic costs, and environmental impact while maximizing lives saved through a comprehensive optimization algorithm.',
            image: '/img/map-img.png',
        },
    ];

    return (
        <section className='bg-black text-white py-20 px-5'>
            <div className='mx-auto overflow-hidden features-parallax'>
                <div className='features-grid grid relative'>
                    {features.map((feature, index) => {
                        // const ref = useRef(null);

                        // const { scrollYProgress } = useScroll({
                        //     target: ref,
                        //     offset: ['0 1', '1 0.8'],
                        // });

                        // const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

                        return (
                            <div
                                key={index}
                                className={`flex flex-col min-h-[300px] border-b overflow-hidden ${
                                    index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'
                                } items-start pt-10 gap-8 md:px-[70px] lg:px-[90px] xl:px-[120px] 2xl:px-[200px] feature-cell`}>
                                {/* Image */}
                                <div
                                    // ref={ref}
                                    // style={{
                                    //     scale: scaleProgress,
                                    //     opacity: scrollYProgress,
                                    // }}
                                    data-aos='fade-up'
                                    className={`md:w-1/2 relative`}>
                                    <div className='absolute w-full h-full'>
                                        <Image
                                            src={feature.image}
                                            alt={'missing'}
                                            width={1920}
                                            height={1080}
                                            className='object-center object-cover h-[300px] rounded-xl border-2'
                                        />
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div
                                    data-aos={index % 2 === 0 ? 'fade-right' : 'fade-left'}
                                    className={`w-full md:w-1/2 ${
                                        index % 2 === 0
                                            ? 'pl-[0.5rem] sm:pl-[1rem] lg:pl-[1rem xl:pl-[5rem] 2xl:pl-[7rem]'
                                            : 'pr-[0.5rem] sm:pr-[1rem] lg:pr-[1rem xl:pr-[5rem] 2xl:pr-[7rem]'
                                    }`}>
                                    <p className='text-blue-400 uppercase font-medium mb-10'>{feature.subtitle}</p>
                                    <h3 className='text-2xl font-bold mb-4'>{feature.title}</h3>
                                    <p className='text-gray-300 leading-relaxed'>{feature.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
