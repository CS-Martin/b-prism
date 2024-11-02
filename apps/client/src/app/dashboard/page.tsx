'use client';

import Link from 'next/link';
import { doCredentialLogin } from '../../hooks/authentication.hook';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const formData = new FormData(event.target as HTMLFormElement);
            const response = await doCredentialLogin(formData);

            if (response?.error) {
                throw new Error(response.error);
            }

            router.push('/map');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <Link href="/auth/register">Register</Link>
            <Link href="/auth/login">Login</Link>
        </div>
    );
};

export default Dashboard;
