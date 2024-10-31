'use client';

import { useUser } from '@auth0/nextjs-auth0/client';

const Dashboard = () => {
    const { user, error, isLoading } = useUser();
    console.log(user);

    return (
        <div>
            <p>hello {user?.name}</p>
            {user && <a href="/api/auth/logout">Logout</a>}
            {!user && <a href="/api/auth/login">Login</a>}
        </div>
    );
};

export default Dashboard;
