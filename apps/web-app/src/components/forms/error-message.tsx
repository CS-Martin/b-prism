import { motion } from 'framer-motion';
import { TriangleAlert } from 'lucide-react';

export const ErrorMessage = ({ message }: { message?: string }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}>
            <p className='flex flex-row items-center pt-1.5 text-xs text-red-400'>
                <TriangleAlert
                    className='mr-1'
                    size={16}
                />
                {message}
            </p>
            <style jsx>{`
                p {
                    margin: 0;
                }
            `}</style>
        </motion.div>
    );
};
