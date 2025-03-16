'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ParticleBackground } from 'apps/web-app/src/components/particle-background';
import { LoginForm } from './_component/login-form';
import { ParticleWrapper } from './_component/particle-wrapper';
import { useEffect, useState } from 'react';
import QuoteCarouselSection from '../../home/_components/quote-section';

export default function LoginPage() {
    const [showParticle, setShowParticle] = useState(false);

    useEffect(() => {
        setShowParticle(true);
    }, []);

    return (
        <div className='flex flex-col md:flex-row w-screen h-screen bg-[#fefeff]'>
            {/* Left Section */}
            <div className='w-full md:w-1/2 text-center md:text-left bg-[#111] md:rounded-2xl flex flex-col justify-between p-6 md:p-10 md:m-8 relative overflow-hidden border border-zinc-800'>
                {/* Particle Background */}

                {/* Content */}
                <div className='relative z-10 flex items-center justify-center mb-6 md:justify-start'>
                    {showParticle && <ParticleWrapper />}
                    <Link
                        href={'/home'}
                        className='flex items-center gap-3'>
                        <Image
                            alt='Your Company'
                            src='/logo/haribon-logo.svg'
                            height={40}
                            width={40}
                        />
                        <div className='text-lg font-bold text-white'>Project Haribon</div>
                    </Link>
                </div>
                <div className='relative z-50 mt-6 text-white md:mt-0'>
                    <div className='text-lg md:text-2xl'>
                        In the face of disaster, we rise not by strength alone, <br /> but by our unwavering will to protect and uplift others. <br />
                    </div>
                    <div className='mt-4 text-sm text-blue-400 md:text-lg'>Join us. Be part of a movement that turns resilience into action.</div>
                </div>
            </div>

            {/* Right Section */}
            <div className='flex items-center justify-center w-full p-6 md:w-1/2 md:p-0'>
                <div className='w-full max-w-md p-6 md:p-10 rounded-2xl'>
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
