'use client';

import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';

import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    Label,
} from '@b-prism/shadcn-ui/index';
import { UserRole } from '@b-prism/enums';
import { useState, useMemo } from 'react';
import { Separator } from '@radix-ui/react-dropdown-menu';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    handleRoleChange: (userId: string, newRole: UserRole) => void;
}

function PaginationComponent({
    pageIndex,
    setPageIndex,
    pageSize,
    dataLength,
}: {
    pageIndex: number;
    setPageIndex: React.Dispatch<React.SetStateAction<number>>;
    pageSize: number;
    dataLength: number;
}) {
    return (
        <div className='flex items-center justify-between border-t py-5'>
            <div className='flex items-center justify-between w-1/2'>
                <Label className=' font-normal'>
                    Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, dataLength)} out of{' '}
                    {dataLength} results
                </Label>
            </div>
            <Pagination className='justify-end w-1/2'>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href='#'
                            onClick={(e) => {
                                e.preventDefault();
                                setPageIndex((prev) => Math.max(prev - 1, 0));
                            }}
                        />
                    </PaginationItem>
                    {Array.from({ length: Math.ceil(dataLength / pageSize) }, (_, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink
                                href='#'
                                isActive={index === pageIndex}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPageIndex(index);
                                }}
                            >
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext
                            href='#'
                            onClick={(e) => {
                                e.preventDefault();
                                setPageIndex((prev) => Math.min(prev + 1, Math.ceil(dataLength / pageSize) - 1));
                            }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 10;

    const paginatedData = useMemo(() => {
        return data.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
    }, [data, pageIndex, pageSize]);

    const table = useReactTable({
        data: paginatedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <>
            <PaginationComponent
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
                pageSize={pageSize}
                dataLength={data.length}
            />
            <div className=''>
                <Table className='w-full'>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
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
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className='h-24 text-center'
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <PaginationComponent
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
                pageSize={pageSize}
                dataLength={data.length}
            />
        </>
    );
}
