'use client';

import Link from 'next/link';

import { Button } from '@b-prism/shadcn-ui/index';
import { useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { SplineSection } from './_components/spline-section';
import BenefitsSection from './_components/benefits-section';
import QuoteCarouselSection from './_components/quote-section';
import FeaturesSection from './_components/features-section';

export default function Home() {
    const { data: session } = useSession();
    const bottomRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className='pt-20 bg-black'>
            <SplineSection />
            <QuoteCarouselSection />
            <BenefitsSection />
            <FeaturesSection />
            <section className='h-[100vh]'></section>

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
