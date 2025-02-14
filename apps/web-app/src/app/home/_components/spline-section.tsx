import Spline from '@splinetool/react-spline';
import { SupportersParallax } from './parallax-text';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Button } from '@b-prism/shadcn-ui/index';

export const SplineSection = () => {
    const staticRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: staticRef,
        offset: ['start start', 'end start'],
    });

    const splineBackground = useTransform(scrollYProgress, [0, 1], ['4%', '-120%']);
    const splineText = useTransform(scrollYProgress, [0, 1], ['7%', '-200%']);

    return (
        <section className='relative overflow-hidden px-[7px] md:px-[75px]  md:h-[100vh]'>
            <div className=''>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    style={{ y: splineBackground }}
                    className='h-[77vh] md:h-[80vh] relative'>
                    <Spline
                        className='rounded-2xl shadow-2xl neon-border'
                        scene='https://prod.spline.design/ng-ni62YpZyz95ES/scene.splinecode'
                    />
                    <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black rounded-2xl'></div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 3 }}
                        style={{ y: splineText }}
                        className='absolute inset-0 flex h-[80%] flex-col items-center top-[10px] text-center mt-14'>
                        <p className='text-[22px] md:text-[40px] font-black'>
                            Unite for Resilience, <br />
                            Act with Precision
                        </p>
                        <p className='md:text-lg mt-3 text-gray-400'>
                            Coordinate rescue efforts, strengthen disaster response, and <br className='md:block hidden' /> safeguard communities with our all-in-one platform.
                        </p>

                        <Button className='bg-blue-500 text-white hover:bg-blue-400 px-6 mt-4 rounded-full'>Start Contributing Now!</Button>
                    </motion.div>
                </motion.div>

                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className=' mt-5 border-b pb-5'>
                    <SupportersParallax />
                </motion.section>
            </div>

            {/* I want a running horizontal icons of  */}
        </section>
    );
};
