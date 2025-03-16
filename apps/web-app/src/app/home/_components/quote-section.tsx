'use client';

import { quotes } from 'apps/web-app/src/utils/constants';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const QuoteCarouselSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        }, 7000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='z-50 text-white border-b border-b-zinc-800'>
            <AnimatePresence>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.8 }}
                    className='absolute px-4 text-center'>
                    <Image
                        src={'/icons/quote.svg'}
                        height={35}
                        width={35}
                        alt='quote.svg'
                        className='w-5 h-auto text-white md:w-10'
                        style={{ fill: 'white' }}
                        data-aos='fade-up'
                    />
                    <p
                        data-aos='fade-up'
                        className='flex text-lg italic md:text-3xl'>
                        {quotes[currentIndex].text}
                    </p>
                    <p
                        data-aos='fade-up'
                        className='mt-4 font-semibold text-md md:text-xl'>
                        — {quotes[currentIndex].author}
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default QuoteCarouselSection;
