import { getServerSession } from 'next-auth';
import { options } from '../../api/auth/[...nextauth]/options';
import { UserDto } from '@dto';

type User = UserDto;

export default async function AdminDashboard() {
    const session = await getServerSession(options);

    return (
        <div>
            <h1>Admin Dashboard</h1>

            {session?.user ? (
                <div>
                    <p>Hi {(session.user as User).given_name}</p>
                </div>
            ) : (
                <p>User not logged in</p>
            )}
        </div>
    );
}
