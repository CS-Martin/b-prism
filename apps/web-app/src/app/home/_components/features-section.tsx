'use client';

import Image from 'next/image';
import { Button } from '@b-prism/shadcn-ui/index';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { haribonFeatures } from 'apps/web-app/src/utils/constants';
import { useRef, useState } from 'react';

const FeaturesSection = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <section className='overflow-hidden text-white p-50 md:py-5 '>
            {/* Video container */}

            {/* Video container with glowing border */}
            <div className='relative'>
                <div
                    data-aos='fade-up'
                    className='flex flex-col w-full gap-3 px-3 mx-auto mt-10 mb-5 md:text-center md:px-0 md:max-w-4xl'>
                    <h2 className='text-lg font-bold md:text-2xl'>Simulate Infrastructure Disruptions</h2>
                    <h4 className='leading-relaxed md:text-lg text-white/80'>
                        Visualize how road networks respond to disasters in real-time. With intelligent damage simulation, you can analyze vulnerabilities, optimize routes, and
                        improve disaster response strategies.
                    </h4>
                </div>

                <div className='glow'></div>
                <Image
                    className='particles'
                    src='/img/particles.png'
                    alt=''
                    width={500}
                    height={500}
                    aria-hidden='true'
                    loading='lazy'
                />

                <div
                    className='relative w-full max-w-6xl mx-auto overflow-hidden md:p-10 md:border-t md:border-l md:border-r md:border-lg md:rounded-t-xl border-zinc-800 '
                    data-aos='fade-up'>
                    <div className='md:p-3 md:bg-white/20 md:rounded-3xl'>
                        <div className='md:rounded-3xl'>
                            <div className='inset-0 hidden md:absolute bg-gradient-to-b from-transparent via-transparent to-black rounded-2xl'></div>
                            <video
                                ref={videoRef}
                                className='object-center w-full h-full md:rounded-3xl'
                                loop
                                autoPlay
                                muted
                                playsInline
                                preload='auto'>
                                <source
                                    src='/videos/home/road-network-damage-simulation.mp4'
                                    type='video/mp4'
                                />
                                Your browser does not support the video tag.
                            </video>

                            {/* Play/Pause button */}
                            <button
                                onClick={togglePlay}
                                className='absolute z-20 p-2 transition-colors rounded-full bottom-3 right-3 md:bottom-6 md:right-6 bg-black/50 md:bg-white/30'>
                                {isPlaying ? (
                                    <Pause
                                        size={20}
                                        className='text-white'
                                    />
                                ) : (
                                    <Play
                                        size={20}
                                        className='text-white'
                                    />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='mx-auto overflow-hidden '>
                <div
                    className='relative grid border-t features-grid border-t-zinc-800 features-vignette'
                    style={{ width: '100%' }}>
                    {haribonFeatures.map((feature, index) => {
                        return (
                            <div
                                key={index}
                                className={`flex md:px-[1rem] lg:px-[5rem] border-b border-b-zinc-800 xl:px-[150px] 2xl:px-[350px] flex-col min-h-[350px] items-start overflow-hidden ${
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
                                            className='object-center object-cover md:h-[500px] max-h-[500px] w-[700px] md:rounded-xl border-2 border-gray-900'
                                        />

                                        {/* Vignette like fadeing effect for image */}
                                        <div className={`${index % 2 === 0 ? 'image-fade-effect-right' : 'image-fade-effect-left'}`}></div>
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div
                                    data-aos={index % 2 === 0 ? 'fade-right' : 'fade-left'}
                                    className={`w-full md:w-1/2 px-3 md:px-0 ${index % 2 === 0 ? 'lg:pr-7' : 'lg:pl-7'} mb-5 md:mb-0`}>
                                    <p className='mb-3 text-[12px] text-blue-400 uppercase md:font-medium md:mb-10'>{feature.subtitle}</p>
                                    <h3 className='mb-4 text-lg font-bold md:text-xl'>{feature.title}</h3>
                                    <p className='leading-relaxed text-gray-300'>{feature.description}</p>
                                    <Button
                                        variant='ghost'
                                        className='mt-3 text-blue-400 hover:text-blue-500 p-0 text-[12px] hover:bg-transparent border-zinc-800'>
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
