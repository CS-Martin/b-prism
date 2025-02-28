'use client';

import { SplineSection } from './_components/spline-section';
import BenefitsSection from './_components/benefits-section';
import QuoteCarouselSection from './_components/quote-section';
import FeaturesSection from './_components/features-section';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';

export default function Home() {
    // const bottomRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();

    console.log(session);

    // const scrollToBottom = () => {
    //     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    // };

    return (
        <div className='pt-20 bg-black'>
            <SplineSection />
            <QuoteCarouselSection />
            <BenefitsSection />
            <FeaturesSection />

            {/* Floating Scroll Button */}
            {/* <button
                onClick={scrollToBottom}
                className='fixed animate-bounce bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-400 transition'>
                <ArrowDown size={28} />
            </button> */}

            {/* Invisible div at the bottom */}
            {/* <div
                ref={bottomRef}
                className='h-[50px]'
            /> */}
        </div>
    );
}
