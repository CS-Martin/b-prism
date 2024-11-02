'use client';

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
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Dashboard;
