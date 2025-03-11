import Image from 'next/image';
import { Button } from '@b-prism/shadcn-ui/index';
import { ArrowRight } from 'lucide-react';

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
        <section className='px-5 overflow-hidden text-white bg-black md:py-5 '>
            <div className='mx-auto overflow-hidden '>
                <div
                    className='relative grid border-t features-grid border-t-zinc-800 features-vignette'
                    style={{ width: '100%' }}>
                    {features.map((feature, index) => {
                        return (
                            <div
                                key={index}
                                className={`flex md:px-[1rem] lg:px-[5rem] border-b border-b-zinc-800 xl:px-[150px] 2xl:px-[350px] flex-col min-h-[350px] items-start  overflow-hidden ${
                                    index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'
                                } pt-10 gap-8 feature-cell`}>
                                {/* Image */}
                                <div
                                    data-aos='fade-up'
                                    className={`md:w-1/2 relative`}>
                                    <div className={`md:absolute w-full h-full flex ${index % 2 === 0 ? 'justify-start lg:pl-7' : 'justify-end lg:pr-7'}`}>
                                        <Image
                                            src={feature.image}
                                            alt={'missing'}
                                            width={1920}
                                            height={1080}
                                            className='object-center object-cover md:h-[500px] max-h-[500px] w-[700px] rounded-xl border-2 border-gray-900'
                                        />

                                        {/* Vignette like fadeing effect for image */}
                                        <div className={`${index % 2 === 0 ? 'image-fade-effect-right' : 'image-fade-effect-left'}`}></div>
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div
                                    data-aos={index % 2 === 0 ? 'fade-right' : 'fade-left'}
                                    className={`w-full md:w-1/2  ${index % 2 === 0 ? 'lg:pr-7' : 'lg:pl-7'} mb-5 md:mb-0`}>
                                    <p className='mb-10 font-medium text-blue-400 uppercase'>{feature.subtitle}</p>
                                    <h3 className='mb-4 text-xl font-bold'>{feature.title}</h3>
                                    <p className='leading-relaxed text-gray-300'>{feature.description}</p>
                                    <Button
                                        variant='ghost'
                                        className='mt-3 p-6 text-[12px] border rounded-md border-zinc-800'>
                                        TRY IT NOW!
                                        <ArrowRight
                                            size={24}
                                            className='animate'
                                        />
                                    </Button>
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
