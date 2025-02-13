'use client';

import { options } from '../api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import Spline from '@splinetool/react-spline';
import Link from 'next/link';

import { Button } from '@b-prism/shadcn-ui/index';
import { useRef } from 'react';
import { ArrowDown, ChevronDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { ParallaxText, SupportersParallax } from './_components/parallax-text';

export default function Home() {
    const { data: session } = useSession();
    console.log(session);
    const bottomRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className='mt-[100px] '>
            <section className='relative px-[75px] h-[100vh]'>
                <div className='h-[80vh]'>
                    <Spline
                        className='rounded-2xl shadow-2xl neon-border'
                        scene='https://prod.spline.design/ng-ni62YpZyz95ES/scene.splinecode'
                    />
                    <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black rounded-2xl'></div>

                    <div className='absolute inset-0 flex flex-col items-center top-[10px] text-center mt-14'>
                        <p className='text-[40px] font-black'>
                            Unite for Resilience, <br />
                            Act with Precision
                        </p>
                        <p className='text-lg mt-3 text-gray-400'>
                            Coordinate rescue efforts, strengthen disaster response, and <br /> safeguard communities with our all-in-one platform.
                        </p>
                    </div>

                    <SupportersParallax />
                </div>

                {/* I want a running horizontal icons of  */}
            </section>

            {session?.user ? (
                <div>
                    <p>Hi {session.user.email}</p>
                </div>
            ) : (
                <p>User not logged in</p>
            )}

            <Button>Button</Button>

            <Link href='/admin/dashboard'>Admin Dashboard</Link>
            <Link href='/auth/register'>Register</Link>
            <Link href='/auth/login'>Login</Link>
            <Link href='/api/auth/signout'>Logout</Link>

            {/* Floating Scroll Button */}
            <button
                onClick={scrollToBottom}
                className='fixed animate-bounce bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-400 transition'>
                <ArrowDown size={28} />
            </button>

            {/* Invisible div at the bottom */}
            <div
                ref={bottomRef}
                className='h-[50px]'
            />
        </div>
    );
}
