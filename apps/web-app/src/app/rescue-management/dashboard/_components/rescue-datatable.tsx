import {
    Button,
    Card,
    CardContent,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Input,
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
import { ChevronDown, Filter, Search, SlidersHorizontal } from 'lucide-react';

interface RescueManagementContentProps {
    rescuePosts: RescuePostDto[];
    session: Session | null;
}

export const RescueManagementContent = ({ rescuePosts, session }: RescueManagementContentProps) => {
    // --- State Managements ---
    const [status, setStatus] = useState<'unattended' | 'pending' | 'rescued' | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<'unattended' | 'pending' | 'rescued' | 'all'>('all');
    const [selectedRescuePost, setSelectedRescuePost] = useState<RescuePostDto | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    // --- Handlers ---

    const handleUpdateStatus = async (rescuePost: RescuePostDto, status: 'unattended' | 'pending' | 'rescued' | null) => {
        setStatus(status);
        setSelectedRescuePost(rescuePost);
        setIsDialogOpen(true);
    };

    const columns = RescueManagementDatatableColumns(handleUpdateStatus);

    const filteredRescuePosts = rescuePosts.filter((post) => {
        const matchesStatus =
            filterStatus === 'all' ||
            (filterStatus === 'unattended' && post.status === 0) ||
            (filterStatus === 'rescued' && post.status === 2) ||
            (filterStatus === 'pending' && post.status === 1);

        const matchesSearch =
            post.location.address?.toLowerCase().includes(searchQuery.toLowerCase()) || post.contact_persons[0]?.name.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    console.log(isDropdownOpen);
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <div className='p-5 border shadow-sm rounded-xl bg-sidebar'>
                <div className='flex flex-row items-center justify-between pb-5 mb-5 border-b'>
                    <div>
                        <h2 className='text-lg font-bold'>Rescue Posts Management</h2>
                        <Label>Monitor and update the status of ongoing rescue operations.</Label>
                    </div>
                </div>
                <div className=''>
                    <div className='flex flex-row items-center justify-between gap-2 mb-3'>
                        <div className='relative flex items-center gap-2 md:w-1/2'>
                            <Search
                                height={18}
                                width={18}
                                className='absolute left-3 text-muted-foreground'
                            />
                            <Input
                                placeholder='Search by location or contact name...'
                                className='pl-10'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant='outline'
                                        size='sm'
                                        onClick={() => setIsDropdownOpen((prev) => !prev)}>
                                        <Filter className='w-4 h-4 mr-2' />
                                        Filter
                                        <ChevronDown className={`w-4 h-4 ml-2 transition-all duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setFilterStatus('all')}>All Rescue Posts</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterStatus('unattended')}>Need Rescue</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterStatus('pending')}>Pending Rescue</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterStatus('rescued')}>Rescued</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <RescueManagementDataTable
                        columns={columns}
                        data={filteredRescuePosts}
                    />
                </div>
            </div>

            {isDialogOpen && selectedRescuePost && (
                <UpdateRescueStatusDialogue
                    rescuePost={selectedRescuePost}
                    isDialogOpen={isDialogOpen}
                    status={status || null}
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
