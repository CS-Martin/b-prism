'use client';

import {
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
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { CreateRoleDatatableColumns } from './role-management-columns';
import { PlusCircle } from 'lucide-react';
import { Session } from 'next-auth';
import { PrismButton } from 'apps/web-app/src/components/prism-button';
import { DeleteRoleDialog } from './delete-role-dialog';
import { RoleDto } from '@dto';
import { useRoleStore } from 'apps/web-app/src/stores/role-stores/role.store';
import { motion } from 'framer-motion';
import { useProgress } from '@bprogress/next';
import { PaginationComponent } from 'apps/web-app/src/components/pagination';

interface RoleManagementDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function RoleManagementDataTable<TData, TValue>({ columns, data }: RoleManagementDataTableProps<TData, TValue>) {
    const pageSize = 5;

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize } },
    });

    useEffect(() => {
        table.setPageSize(pageSize);
    }, [table, pageSize]);

    return (
        <div>
            <div className='grid grid-cols-1 overflow-x-auto'>
                <Table>
                    <TableHeader className='sticky top-0 z-10 bg-sidebar'>
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
    const { start: loadStart, stop: loadStop } = useProgress();
    const { roles, isLoading, error, displayRoles } = useRoleStore();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [selectedRole, setSelectedRole] = useState<RoleDto | null>(null);

    if (isLoading) {
        loadStart();
    } else {
        loadStop();
    }

    useEffect(() => {
        if (!roles || roles.length === 0) {
            displayRoles(session.user.access_token);
        }
    }, []);

    if (error) {
        return <div className='p-5 rounded-md prism-card-bg'>Error: {error}</div>;
    }

    const handleDeleteClick = async (role: RoleDto) => {
        setSelectedRole(role);
        setIsDeleteDialogOpen(true);
    };

    const columns = CreateRoleDatatableColumns(handleDeleteClick);

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
                <DeleteRoleDialog
                    session={session}
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    role={selectedRole}
                />
            </div>
        </motion.div>
    );
};
