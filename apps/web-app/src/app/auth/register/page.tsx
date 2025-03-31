import Image from 'next/image';
import Link from 'next/link';
import { ParticleWrapper } from '../../../components/providers/particle-wrapper';
import RegisterPage from './_components/register-form';

export default function LoginPage() {
    return (
        <div className='flex flex-col w-screen h-screen md:flex-row'>
            {/* Left Section */}
            <div className='w-full md:w-1/2 text-center md:text-left bg-[#111] md:rounded-2xl flex flex-col justify-between p-6 md:p-10 md:m-8 relative overflow-hidden border border-zinc-800'>
                {/* Particle Background */}

                {/* Content */}
                <div className='relative z-10 flex items-center justify-center md:mb-6 md:justify-start'>
                    <ParticleWrapper />
                    <Link
                        href={'/home'}
                        className='flex items-center gap-3'>
                        <Image
                            alt='Your Company'
                            src='/logo/haribon-logo.svg'
                            height={40}
                            width={40}
                        />
                        <div className='hidden text-lg font-bold text-white md:block'>Project Haribon</div>
                    </Link>
                </div>
                <div className='relative z-50 hidden mt-6 text-white md:block md:mt-0'>
                    <div className='text-lg md:text-2xl'>
                        In the face of disaster, we rise not by strength alone, <br /> but by our unwavering will to protect and uplift others. <br />
                    </div>
                    <div className='mt-4 text-sm text-blue-400 md:text-lg'>Join us. Be part of a movement that turns resilience into action.</div>
                </div>
            </div>

            {/* Right Section */}
            <div className='flex items-center justify-center max-w-lg mx-auto md:w-1/2 md:p-6'>
                <div className='p-5'>
                    <RegisterPage />
                </div>
            </div>
        </div>
    );
}
