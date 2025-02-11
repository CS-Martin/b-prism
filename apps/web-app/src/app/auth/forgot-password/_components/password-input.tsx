interface PasswordInputProps {
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;

    confirmPassword: string;
    setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
}

export const PasswordInput = ({ password, setPassword, confirmPassword, setConfirmPassword }: PasswordInputProps) => {
    return (
        <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>New Password</label>
            <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white'
                placeholder='Enter new password'
                required
            />
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mt-3'>Confirm Password</label>
            <input
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white'
                placeholder='Confirm new password'
                required
            />
            {password && confirmPassword && password !== confirmPassword && <p className='text-red-500 text-xs mt-1'>Passwords do not match!</p>}
        </div>
    );
};
