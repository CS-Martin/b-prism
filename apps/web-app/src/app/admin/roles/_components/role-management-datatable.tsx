'use client';

import { Button, Label, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@b-prism/shadcn-ui/index';
import { ColumnDef, flexRender, getCoreRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { CreateRoleDatatableColumns } from './role-management-columns';
import { useDisplayRoles } from 'apps/web-app/src/hooks/role.hook';
import { Plus, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Session } from 'next-auth';
import { PrismButton } from 'apps/web-app/src/components/prism-button';

interface RoleManagementDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function RoleManagementDataTable<TData, TValue>({ columns, data }: RoleManagementDataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className='border rounded-md'>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                                className='cursor-pointer'>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className='h-24 text-center'>
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

interface RoleManagementContentProps {
    session: Session;
}

export const RoleManagementContent = ({ session }: RoleManagementContentProps) => {
    const { roles, isLoading, error, displayRoles } = useDisplayRoles();

    useEffect(() => {
        displayRoles(session.user.access_token);
    }, []);

    console.log(roles);

    if (isLoading) {
        return <div className='p-5 mt-5 rounded-md prism-card-bg'>Loading...</div>;
    }

    if (error) {
        return <div className='p-5 mt-5 rounded-md prism-card-bg'>Error: {error}</div>;
    }

    const columns = CreateRoleDatatableColumns();

    return (
        <div className='p-5 mt-5 rounded-md prism-card-bg h'>
            <div className='flex flex-row items-center justify-between pb-5 mb-5 border-b'>
                <div>
                    <h2 className='text-lg font-bold'>Role Management</h2>
                    <Label>Manage your existing roles to control access and permissions within the application.</Label>
                </div>
                <div>
                    <PrismButton
                        type='button'
                        label='Create New Role'
                        isLoading={isLoading}
                        icon={
                            <PlusCircle
                                height={24}
                                width={24}
                            />
                        }
                        link={'/admin/roles/create'}
                        style='bg-blue-500 hover:bg-blue-600 flex text-white'
                    />
                </div>
            </div>
            <RoleManagementDataTable
                columns={columns}
                data={roles}
            />
        </div>
    );
};
