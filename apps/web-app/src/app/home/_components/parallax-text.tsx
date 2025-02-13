import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame } from 'framer-motion';
import { useRef } from 'react';
import { wrap } from '@motionone/utils';

interface ParallaxProps {
    children: React.ReactNode;
    baseVelocity: number;
}

export function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400,
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false,
    });

    const x = useTransform(baseX, (v) => `${wrap(20, -45, v)}%`);
    const directionFactor = useRef<number>(1);

    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();
        baseX.set(baseX.get() + moveBy);
    });

    return (
        <div className='parallax overflow-hidden relative'>
            <motion.div
                className='scroller flex mb-3 space-x-10 justify-center items-center'
                style={{ x }}>
                {children}
                {children}
                {children}
            </motion.div>
        </div>
    );
}

export const SupportersParallax = () => {
    const companies = [
        { name: 'Adidas', logo: '/icons/accenture-logo.svg' },
        { name: 'Atlassian', logo: '/icons/atlassian-logo.svg' },
        { name: 'Logitech', logo: '/icons/logitech-logo.svg' },
        { name: 'IBM', logo: '/icons/meta-logo.svg' },
    ];

    return (
        <div className='mt-10 bg-transparent'>
            <ParallaxText baseVelocity={-2}>
                {companies.map((company, index) => (
                    <div
                        key={index}
                        className='flex flex-col items-center'>
                        <img
                            src={company.logo}
                            alt={`${company.name} logo`}
                            className='filter w-[200px] h-auto invert-[100%] brightness-0'
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                ))}
            </ParallaxText>
            <ParallaxText baseVelocity={2}>
                {companies.map((company, index) => (
                    <div
                        key={index}
                        className='flex flex-col items-center'>
                        <img
                            src={company.logo}
                            alt={`${company.name} logo`}
                            className='filter w-[200px] h-auto invert-[100%] brightness-0'
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                ))}
            </ParallaxText>
        </div>
    );
};
