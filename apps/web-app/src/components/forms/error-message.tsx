import { motion } from 'framer-motion';

export const ErrorMessage = ({ message }: { message?: string }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}>
            <p className='text-sm text-red-500'>{message}</p>
            <style jsx>{`
                p {
                    margin: 0;
                }
            `}</style>
        </motion.div>
    );
};
