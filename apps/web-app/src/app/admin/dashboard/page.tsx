'use client';

import { UserDto } from '@dto';

import { UserRole } from '@b-prism/enums';
import { useDisplayUsers } from '../../../hooks/admin-dashboard.hook';
import { useState } from 'react';

type User = UserDto;

export default function AdminDashboard() {
    // const session = useSession().data?.user;

    const { users, isLoading } = useDisplayUsers();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const handleRoleChange = (userId: string, newRole: UserRole) => {
        console.log(`Changing role for user ${userId} to ${newRole}`);
    };

    return (
        <div className="p-10">
            <h1>Admin Dashboard</h1>

            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200">
                    <caption className="text-lg font-semibold mb-4">
                        A list of your recent invoices.
                    </caption>
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2 w-[100px]">
                                #
                            </th>
                            <th className="border border-gray-300 p-2">Name</th>
                            <th className="border border-gray-300 p-2">
                                Surename
                            </th>
                            <th className="border border-gray-300 p-2">
                                Email
                            </th>
                            <th className="border border-gray-300 p-2">
                                Office
                            </th>
                            <th className="border border-gray-300 p-2">
                                Position
                            </th>
                            <th className="border border-gray-300 p-2">
                                ID Image
                            </th>
                            <th className="border border-gray-300 p-2">Role</th>
                            <th className="border border-gray-300 p-2 text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: User, index: number) => (
                            <tr key={user.id} className="hover:bg-gray-100">
                                <td className="border border-gray-300 p-2">
                                    {index + 1}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {user.given_name}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {user.family_name}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {user.email}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {user.office}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {user.position}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {user.id_image_url}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {user.role}
                                </td>
                                <td className="border border-gray-300 p-2 text-right">
                                    <div className="relative inline-block text-left">
                                        <div>
                                            <button
                                                type="button"
                                                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                onClick={() =>
                                                    setDropdownOpen(
                                                        !dropdownOpen
                                                    )
                                                }
                                            >
                                                Actions
                                            </button>
                                        </div>
                                        {dropdownOpen && (
                                            <div className="absolute right-0 z-10 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                                <div
                                                    className="py-1"
                                                    role="menu"
                                                    aria-orientation="vertical"
                                                    aria-labelledby="options-menu"
                                                >
                                                    {Object.values(
                                                        UserRole
                                                    ).map((role) =>
                                                        user.role !== role ? (
                                                            <button
                                                                key={role}
                                                                onClick={() =>
                                                                    handleRoleChange(
                                                                        user.id,
                                                                        role
                                                                    )
                                                                }
                                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                {(() => {
                                                                    switch (
                                                                        role
                                                                    ) {
                                                                        case UserRole.admin:
                                                                            return 'Make Admin';
                                                                        case UserRole.verified:
                                                                            return 'Verify User';
                                                                        case UserRole.unverified:
                                                                            return 'Unverify User';
                                                                        default:
                                                                            return null;
                                                                    }
                                                                })()}
                                                            </button>
                                                        ) : null
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
