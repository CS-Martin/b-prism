import { getServerSession } from 'next-auth';
import { options } from '../../api/auth/[...nextauth]/options';
import { UserDto } from '@dto';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@b-prism/ui-components';
import { userService } from 'apps/client/src/services/user-service';

type User = UserDto;

export default async function AdminDashboard() {
    const session = await getServerSession(options);

    const response = (await userService.findAll()) || [];

    // @ts-ignore
    const users = response.body.map((user: UserDto) => ({
        id: user.id,
        given_name: user.given_name,
        family_name: user.family_name,
        email: user.email,
        office: user.office,
        position: user.position,
        id_image_url: user.id_image_url,
        role: user.role,
    }));

    return (
        <div>
            <h1>Admin Dashboard</h1>

            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Surename</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Office</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>ID Image</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user: User, index: number) => (
                        <TableRow key={user.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{user.given_name}</TableCell>
                            <TableCell>{user.family_name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.office}</TableCell>
                            <TableCell>{user.position}</TableCell>
                            <TableCell>{user.id_image_url}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell className="text-right">
                                $250.00
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

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
