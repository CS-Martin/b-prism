'use client';

import { SplineSection } from './_components/spline-section';
import BenefitsSection from './_components/benefits-section';
import QuoteCarouselSection from './_components/quote-section';
import FeaturesSection from './_components/features-section';
import { useSession } from 'next-auth/react';
import { HaribonFooter } from '../../components/footer';

export default function Home() {
    const { data: session, status } = useSession();

    return (
        <div className='pt-20 bg-black'>
            <SplineSection />
            <QuoteCarouselSection />
            <BenefitsSection />
            <FeaturesSection />

            <HaribonFooter className='text-white' />

            {/* Floating Scroll Button */}
            {/* <button
                onClick={scrollToBottom}
                className='fixed flex items-center justify-center text-white transition bg-blue-500 rounded-full shadow-lg animate-bounce bottom-6 right-6 w-14 h-14 hover:bg-blue-400'>
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
