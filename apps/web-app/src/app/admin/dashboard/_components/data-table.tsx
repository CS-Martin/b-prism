'use client';

import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { motion } from 'framer-motion';

import { TableBody, TableCell, TableHead, TableHeader, TableRow, Label, Table } from '@b-prism/shadcn-ui/index';
import { useEffect, useState } from 'react';
import { createColumns } from './columns';
import { Session } from 'next-auth';
import { UserDto } from '@dto';
import { ChangeRoleDialog } from './change-role-dialog';
import { useProgress } from '@bprogress/next';
import { useUserStore } from 'apps/web-app/src/stores/user-stores/user.store';
import { PaginationComponent } from 'apps/web-app/src/components/pagination';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export const DataTableContent = ({ session }: { session: Session | null }) => {
    const { start: startLoad, stop: stopLoad } = useProgress();
    const { users, isLoading, fetchAllUsers } = useUserStore();
    const [isRoleChangeDialogOpen, setIsRoleChangeDialogOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

    if (isLoading) {
        startLoad();
    } else {
        stopLoad();
    }

    useEffect(() => {
        if (session?.user && users.length === 0) {
            fetchAllUsers(session.user.access_token);
        }
    }, [session?.user]);

    const handleRoleChange = async (user: UserDto) => {
        setSelectedUser(user);
        setIsRoleChangeDialogOpen(true);
    };

    const columns = createColumns(handleRoleChange);

    return (
        <motion.div
            className='px-5 mt-5'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <div className='p-5 border shadow-sm rounded-xl bg-sidebar'>
                <div className='flex flex-row items-center justify-between pb-5 mb-5 border-b'>
                    <div>
                        <h2 className='text-lg font-bold'>User Management</h2>
                        <Label>Manage user roles, access, and permissions.</Label>
                    </div>
                </div>
                <DataTable
                    columns={columns}
                    data={users}
                />

                {isRoleChangeDialogOpen && (
                    <ChangeRoleDialog
                        session={session}
                        isOpen={isRoleChangeDialogOpen}
                        onClose={() => setIsRoleChangeDialogOpen(false)}
                        user={selectedUser}
                    />
                )}
            </div>
        </motion.div>
    );
};

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const pageSize = 10;

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    });

    return (
        <div className='relative overflow-hidden h-[calc(100vh-230px)]'>
            <div className='h-[85%] overflow-y-auto border rounded-lg'>
                <Table>
                    <TableHeader className='sticky top-0 z-10 bg-sidebar'>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className='px-0'>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className='py-3'>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className='text-center h-28'>
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <PaginationComponent<TData>
                pageSize={pageSize}
                dataLength={data.length}
                table={table}
            />
        </div>
    );
}
