import { motion } from 'framer-motion';
import { TriangleAlert } from 'lucide-react';

interface ErrorMessageProps {
    message?: string | string[];
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
    if (!message || (Array.isArray(message) && message.length === 0)) return null;

    // -> Normalize the messages into an array
    const messages = Array.isArray(message) ? message : [message];

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className='flex flex-col items-start justify-start w-full space-y-1'>
            {/* Loop through the messages array */}
            {messages.map((msg, index) => (
                <p
                    key={index}
                    className='flex flex-row items-center pt-1.5 text-xs text-red-400'>
                    <TriangleAlert
                        className='mr-1'
                        size={14}
                    />
                    <span>{msg}</span>
                </p>
            ))}
        </motion.div>
    );
};
