import { Input } from '@b-prism/shadcn-ui/index';

interface InputEmailProps {
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
}

export const InputEmail = ({ email, setEmail }: InputEmailProps) => {
    return (
        <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Email Address</label>
            <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white'
                placeholder='Enter your email'
                required
            />
        </div>
    );
};
