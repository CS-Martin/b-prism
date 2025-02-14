import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const quotes = [
    {
        text: 'We cannot stop natural disasters but we can arm ourselves with knowledge',
        author: 'Petra Nemcova',
    },
    {
        text: 'By failing to prepare, you are preparing to fail.',
        author: 'Benjamin Franklin',
    },
    {
        text: `Some people don't like change, but you need to embrace change if the alternative is disaster.`,
        author: 'Blake Ross',
    },
];

const QuoteCarouselSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        }, 7000); // Change quote every 10s

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='w-full h-48 flex items-center justify-center border-b text-white'>
            <AnimatePresence>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.8 }}
                    className='absolute text-center px-4'>
                    <Image
                        src={'icons/quote.svg'}
                        height={35}
                        width={35}
                        alt='quote.svg'
                        className='text-white'
                        style={{ fill: 'white' }}
                        data-aos='fade-up'
                    />
                    <p
                        data-aos='fade-up'
                        className='text-2xl md:text-3xl italic flex'>
                        {quotes[currentIndex].text}
                    </p>
                    <p
                        data-aos='fade-up'
                        className='mt-4 text-lg md:text-xl font-semibold'>
                        — {quotes[currentIndex].author}
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default QuoteCarouselSection;
