'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@b-prism/shadcn-ui/index';
import { ColumnDef, flexRender, getCoreRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { CreateRoleDatatableColumns } from './role-management-columns';
import { useDisplayRoles } from 'apps/web-app/src/hooks/role.hook';

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
                                data-state={row.getIsSelected() && 'selected'}>
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

export const RoleManagementContent = () => {
    const { roles, isLoading, error, displayRoles } = useDisplayRoles();

    useEffect(() => {
        displayRoles();
    }, []);

    if (isLoading) {
        return <div className='p-5 mt-5 rounded-md prism-card-bg'>Loading...</div>;
    }

    if (error) {
        return <div className='p-5 mt-5 rounded-md prism-card-bg'>Error: {error}</div>;
    }

    const columns = CreateRoleDatatableColumns();

    console.log(roles);

    return (
        <div className='p-5 mt-5 rounded-md prism-card-bg'>
            <RoleManagementDataTable
                columns={columns}
                data={roles}
            />
        </div>
    );
};
