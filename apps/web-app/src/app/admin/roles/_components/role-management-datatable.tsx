'use client';

import {
    Button,
    Label,
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@b-prism/shadcn-ui/index';
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, SortingState, useReactTable } from '@tanstack/react-table';
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

function PaginationComponent<TData>({ pageSize, dataLength, table }: { pageSize: number; dataLength: number; table: ReturnType<typeof useReactTable<TData>> }) {
    return (
        <div className='absolute bottom-0 flex items-center justify-between w-full px-5 py-5 border rounded-lg prism-card-bg'>
            <div className='flex items-center justify-between w-1/2'>
                <Label className='font-normal '>
                    Showing {table.getState().pagination.pageIndex * pageSize + 1} to {Math.min((table.getState().pagination.pageIndex + 1) * pageSize, dataLength)} out of{' '}
                    {dataLength} results
                </Label>
            </div>
            <Pagination className='justify-end w-1/2'>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => table.previousPage()}
                            className={`rounded-sm cursor-pointer ${!table.getCanPreviousPage() ? 'opacity-50 pointer-events-none' : ''}`}
                        />
                    </PaginationItem>
                    {Array.from({ length: Math.ceil(dataLength / pageSize) }, (_, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink
                                href='#'
                                isActive={index === table.getState().pagination.pageIndex}
                                onClick={(e) => {
                                    e.preventDefault();
                                    table.setPageIndex(index);
                                }}
                                className={`cursor-pointer ${index === table.getState().pagination.pageIndex ? 'bg-blue-500 text-white' : ''}`}>
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext
                            isActive={false}
                            onClick={() => table.nextPage()}
                            className={`rounded-sm cursor-pointer ${!table.getCanNextPage() ? 'opacity-50 pointer-events-none' : ''}`}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}

export function RoleManagementDataTable<TData, TValue>({ columns, data }: RoleManagementDataTableProps<TData, TValue>) {
    const pageSize = 5;

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize } }, // Apply page size here
    });

    useEffect(() => {
        table.setPageSize(pageSize);
    }, [table, pageSize]);

    return (
        <div className='relative overflow-hidden h-[calc(100vh-230px)]'>
            <div className='h-[85%] overflow-y-auto border rounded-lg'>
                <Table>
                    <TableHeader className='sticky top-0 z-10 border shadow-2xl prism-card-bg'>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                                ))}
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

            <PaginationComponent<TData>
                pageSize={pageSize}
                dataLength={data.length}
                table={table}
            />
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
