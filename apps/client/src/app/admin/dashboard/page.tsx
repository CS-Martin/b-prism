import { getServerSession } from 'next-auth';
import { options } from '../../api/auth/[...nextauth]/options';
import { UserDto } from '@dto';

import {
    Button,
    DropdownMenuPortal,
    DropdownMenuSubTrigger,
    DropdownMenuSub,
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    DropdownMenuSubContent,
} from '@b-prism/ui-components';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    DropdownMenuShortcut,
} from '@b-prism/ui-components';

import { userService } from 'apps/client/src/services/user-service';
import { Mail, PlusCircle, MessageSquare, Plus, LogOut } from 'lucide-react';

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
        <div className="p-10">
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
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">Open</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-32 rounded-[8px]">
                                        <DropdownMenuItem className="cursor-pointer">
                                            <span>Verify</span>
                                            <DropdownMenuShortcut>
                                                ⇧⌘Q
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
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
