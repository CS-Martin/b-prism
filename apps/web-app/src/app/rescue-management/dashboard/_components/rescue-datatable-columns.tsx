import { Badge, Button } from '@b-prism/shadcn-ui/index';
import { ContactPersonDto, LocationDto, RescuePostDto } from '@dto';
import { Row } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import { Users } from 'lucide-react';

export const RescueManagementDatatableColumns = (handleUpdateStatus: (rescuePost: RescuePostDto, status: 'rescued' | 'pending' | 'unattended' | null) => void) => {
    return [
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }: { row: Row<RescuePostDto> }) => {
                const status = row.getValue('status');

                return (
                    <div className='min-w-[100px] flex items-center'>
                        <>
                            {(() => {
                                switch (status) {
                                    case 0: // Need rescue
                                        return <Badge variant='destructive'>Need rescue</Badge>;
                                    case 1: // Pending
                                        return (
                                            <Badge
                                                variant='destructive'
                                                className='text-white bg-orange-500'>
                                                Pending
                                            </Badge>
                                        );
                                    case 2: // Rescued
                                        return (
                                            <Badge
                                                variant='outline'
                                                className='text-green-500 border-green-500'>
                                                Rescued
                                            </Badge>
                                        );
                                    default:
                                        return null;
                                }
                            })()}
                        </>
                    </div>
                );
            },
        },
        {
            accessorKey: 'location',
            header: 'Location',
            cell: ({ row }: { row: Row<RescuePostDto> }) => {
                const location: LocationDto = row.getValue('location');
                return (
                    <div className='flex flex-col min-w-[200px] max-w-[250px] truncate'>
                        <span className='font-medium truncate max-w-[250px]'>{location.address}</span>
                        <span className='text-xs text-muted-foreground truncate max-w-[200px]'>{location.landmark}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'number_of_people_affected',
            header: 'Affected People',
            cell: ({ row }: { row: Row<RescuePostDto> }) => {
                const r: RescuePostDto = row.original;

                return (
                    <div className='min-w-[160px] flex items-center gap-1'>
                        <Users className='w-3 h-3 text-muted-foreground' />
                        <span>{r.number_of_people_affected}</span>
                        <span className='ml-1 text-xs text-muted-foreground'>
                            ({r.demographics?.total_adults}A, {r.demographics?.total_children}C, {r.demographics?.total_elderly}E)
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'contact_persons',
            header: 'Contact',
            cell: ({ row }: { row: Row<RescuePostDto> }) => {
                const contactPersons: ContactPersonDto[] = row.getValue('contact_persons');
                return (
                    <div className='min-w-[160px] flex flex-col'>
                        <span className='font-medium'>{contactPersons[0].name}</span>
                        <span className='text-xs text-muted-foreground'>{contactPersons[0].contact}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'created_at',
            header: 'Date',
            cell: ({ row }: { row: Row<RescuePostDto> }) => {
                const createdAt = new Date(row.getValue('created_at'));

                const formatted = createdAt.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                });

                const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

                return (
                    <div className=' min-w-[180px] flex flex-col'>
                        <span className='text-xs'>{formatted}</span>
                        <span className='text-xs text-muted-foreground'>{timeAgo}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'created_by',
            header: '',
            cell: ({ row }: { row: Row<RescuePostDto> }) => {
                const r: RescuePostDto = row.original;

                return (
                    <div className='min-w-[200px] flex justify-end gap-2'>
                        <Button
                            variant='ghost'
                            size='sm'
                            className='w-40 text-blue-500'>
                            View
                        </Button>

                        {r.status === 0 ? (
                            <Button
                                size='sm'
                                variant='destructive'
                                className='text-white bg-yellow-500 w-44 hover:bg-yellow-600'
                                onClick={() => handleUpdateStatus(r, 'pending')}>
                                Dispatch Rescue Team
                            </Button>
                        ) : r.status === 1 ? (
                            <Button
                                size='sm'
                                variant='default'
                                className='text-white bg-green-500 w-44 hover:bg-green-600'
                                onClick={() => handleUpdateStatus(r, 'rescued')}>
                                Mark Rescued
                            </Button>
                        ) : r.status === 2 ? (
                            <Button
                                size='sm'
                                variant='default'
                                className='w-44'
                                onClick={() => handleUpdateStatus(r, 'unattended')}>
                                Mark Unattended
                            </Button>
                        ) : null}
                    </div>
                );
            },
        },
    ];
};
