'use client';

import { options } from '../api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import Spline from '@splinetool/react-spline';
import Link from 'next/link';

import { Button } from '@b-prism/shadcn-ui/index';
import { useRef } from 'react';
import { ArrowDown, ChevronDown } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function Home() {
    const { data: session } = useSession();
    console.log(session);
    const bottomRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className=''>
            <section className='relative h-[100vh]'>
                <Spline
                    className='w-full h-[100vh]'
                    scene='https://prod.spline.design/ng-ni62YpZyz95ES/scene.splinecode'
                />
                <div className='absolute bottom-0 left-0 mb-8 ml-[75px] flex flex-col items-start '>
                    <p className='text-xl text-left '>
                        Hazard Assessment and Rescue <br /> Integration for Bicol Operations Network
                    </p>
                    <p className='leading-[150px] text-[128px] font-thunderblack-lc  border-b border-white '>PROJECT HARIBON</p>
                    <p className=' text-xl  text-left mt-3'>
                        Coordinate rescue efforts, strengthen disaster response, and <br /> safeguard communities with our all-in-one platform.
                    </p>
                </div>
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
