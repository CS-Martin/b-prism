import {
    Card,
    CardContent,
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
import { RescueManagementDatatableColumns } from './rescue-datatable-columns';
import { motion } from 'framer-motion';
import { RescuePostDto } from '@dto';
import { Session } from 'next-auth';
import { UpdateRescueStatusDialogue } from './update-rescue-status-dialogue';

interface RescueManagementContentProps {
    rescuePosts: RescuePostDto[];
    session: Session | null;
}

export const RescueManagementContent = ({ rescuePosts, session }: RescueManagementContentProps) => {
    // --- State Managements ---
    const [status, setStatus] = useState<'rescued' | 'pending'>();
    const [selectedRescuePost, setSelectedRescuePost] = useState<RescuePostDto | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    // --- Handlers ---

    const handleUpdateStatus = async (rescuePost: RescuePostDto, status: 'rescued' | 'pending') => {
        console.log(rescuePost, status);
        setStatus(status);
        setSelectedRescuePost(rescuePost);
        setIsDialogOpen(true);
    };

    const columns = RescueManagementDatatableColumns(handleUpdateStatus);

    return (
        <motion.div
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
                </div>
                <RescueManagementDataTable
                    columns={columns}
                    data={rescuePosts}
                />
            </div>

            {isDialogOpen && selectedRescuePost && (
                <UpdateRescueStatusDialogue
                    rescuePost={selectedRescuePost}
                    isDialogOpen={isDialogOpen}
                    status={status || 'pending'}
                    onClose={() => setIsDialogOpen(false)}
                    session={session}
                />
            )}
        </motion.div>
    );
};

interface RescueManagementDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function RescueManagementDataTable<TData, TValue>({ columns, data }: RescueManagementDataTableProps<TData, TValue>) {
    const pageSize = 7;

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

            <PaginationComponent<TData>
                pageSize={pageSize}
                dataLength={data.length}
                table={table}
            />
        </div>
    );
}

function PaginationComponent<TData>({ pageSize, dataLength, table }: { pageSize: number; dataLength: number; table: ReturnType<typeof useReactTable<TData>> }) {
    return (
        <div className='flex flex-row items-center justify-between w-full p-5 mt-4 border rounded-lg'>
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
