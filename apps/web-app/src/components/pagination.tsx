import { Label, Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@b-prism/shadcn-ui/index';
import { useReactTable } from '@tanstack/react-table';

interface PaginationComponent<TData> {
    pageSize: number;
    dataLength: number;
    table: ReturnType<typeof useReactTable<TData>>;
}

export function PaginationComponent<TData>({ pageSize, dataLength, table }: PaginationComponent<TData>) {
    return (
        <div className='items-center w-full p-1.5 mt-4 border rounded-lg md:p-5 md:flex md:flex-row md:justify-between'>
            <div className='items-center justify-between hidden w-1/2 md:flex'>
                <Label className='font-normal '>
                    Showing {table.getState().pagination.pageIndex * pageSize + 1} to {Math.min((table.getState().pagination.pageIndex + 1) * pageSize, dataLength)} out of{' '}
                    {dataLength} results
                </Label>
            </div>
            <Pagination className='md:justify-end md:w-1/2'>
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
