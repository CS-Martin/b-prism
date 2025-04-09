import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

interface AnimatedCounterProps {
    value: number;
}

export const AnimatedCounter = ({ value }: AnimatedCounterProps) => {
    const motionValue = useMotionValue(value);
    const spring = useSpring(motionValue, { damping: 20, stiffness: 100 });
    const rounded = useTransform(spring, (latest) => Math.round(latest));

    useEffect(() => {
        motionValue.set(value);
    }, [value, motionValue]);

    return <motion.span>{rounded}</motion.span>;
};
