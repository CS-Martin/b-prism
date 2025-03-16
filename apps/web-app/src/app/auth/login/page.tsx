'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ParticleBackground } from 'apps/web-app/src/components/particle-background';
import { LoginForm } from './_component/login-form';
import { ParticleWrapper } from './_component/particle-wrapper';
import { useEffect, useState } from 'react';

export default function LoginPage() {
    const [showParticle, setShowParticle] = useState(false);

    useEffect(() => {
        setShowParticle(true);
    }, []);

    return (
        <div className='flex h-screen'>
            {/* Left Section */}
            <div className='w-1/2 bg-[#111] rounded-2xl flex flex-col justify-between p-10 m-8 relative overflow-hidden border boder-zinc-800'>
                {/* Particle Background */}

                {/* Content */}
                <div className='relative z-10 w-[50px]'>
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
                        <div className='text-lg font-bold leading-4 text-white l'>Project Haribon</div>
                    </Link>
                </div>
                <div className='relative z-10 mb-4 text-gray-400'>
                    “This system helps deliver life-saving operations with unprecedented speed and accuracy.”
                    <br /> - HARIBON Team
                </div>
            </div>

            <div className='flex items-center justify-center w-1/2 '>
                <div className='w-full max-w-md p-10 rounded-2xl'>
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
