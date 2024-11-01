'use client';

import { useUser } from '@auth0/nextjs-auth0/client';

const Dashboard = () => {
    const { user, error, isLoading } = useUser();
    console.log(user);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <p>hello {user?.name}</p>
            <p>
                Go to map <a href="/map">here</a>
            </p>
            {user ? (
                <a href="/api/auth/logout">Logout</a>
            ) : (
                <a href="/api/auth/login">Login</a>
            )}
        </div>
    );
};

export default Dashboard;
