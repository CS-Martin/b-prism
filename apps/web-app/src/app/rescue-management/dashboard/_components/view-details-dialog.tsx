import { Badge, Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Label, Switch } from '@b-prism/shadcn-ui/index';
import { RescuePostDto } from '@dto';
import { customDateFormatter } from 'apps/web-app/src/utils/date-formatter';
import { formatDistanceToNow, formatDistanceToNowStrict } from 'date-fns';
import { MapPin, Phone } from 'lucide-react';
import { Session } from 'next-auth';

interface ViewRescueDetailsDialogProps {
    selectedPost: RescuePostDto | null;
    isViewRescueDetailOpen: boolean;
    session: Session | null;
    onClose: () => void;
}

export const ViewRescueDetailsDialog = ({ selectedPost, isViewRescueDetailOpen, session, onClose }: ViewRescueDetailsDialogProps) => {
    return (
        <Dialog open={isViewRescueDetailOpen}>
            {selectedPost && (
                <DialogContent className='sm:max-w-[600px]'>
                    <DialogHeader>
                        <DialogTitle className='flex items-center gap-2'>
                            <MapPin className='w-5 h-5' />
                            Rescue Post Details
                        </DialogTitle>
                        <DialogDescription>Complete information about this rescue request</DialogDescription>
                    </DialogHeader>

                    <div className='grid gap-4 py-4'>
                        <div className='flex items-center justify-between'>
                            <h3 className='font-semibold'>Status</h3>
                            {/* <Badge
                                variant={selectedPost.isRescued ? 'outline' : 'destructive'}
                                className={selectedPost.isRescued ? 'border-green-500 text-green-500' : ''}>
                                {selectedPost.isRescued ? 'Rescued' : 'Pending Rescue'}
                            </Badge> */}
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <h3 className='mb-1 font-semibold'>Location</h3>
                                <p className='text-sm'>{selectedPost.location.address}</p>
                                <p className='mt-1 text-xs text-muted-foreground'>Landmark: {selectedPost.location.landmark}</p>
                                <p className='mt-1 text-xs text-muted-foreground'>
                                    Coordinates: {selectedPost.location.latitude}, {selectedPost.location.longitude}
                                </p>
                            </div>

                            <div>
                                <h3 className='mb-1 font-semibold'>People Affected</h3>
                                <p className='text-sm'>Total: {selectedPost.number_of_people_affected}</p>
                                <div className='grid grid-cols-3 gap-2 mt-1'>
                                    <div className='flex flex-col items-center p-1 rounded-md bg-muted'>
                                        <span className='text-xs text-muted-foreground'>Adults</span>
                                        <span className='font-medium'>{selectedPost.demographics?.total_adults}</span>
                                    </div>
                                    <div className='flex flex-col items-center p-1 rounded-md bg-muted'>
                                        <span className='text-xs text-muted-foreground'>Children</span>
                                        <span className='font-medium'>{selectedPost.demographics?.total_children}</span>
                                    </div>
                                    <div className='flex flex-col items-center p-1 rounded-md bg-muted'>
                                        <span className='text-xs text-muted-foreground'>Elderly</span>
                                        <span className='font-medium'>{selectedPost.demographics?.total_elderly}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className='mb-1 font-semibold'>Contact Persons</h3>
                            <div className='space-y-2'>
                                {selectedPost.contact_persons.map((person: any, index: number) => (
                                    <div
                                        key={index}
                                        className='flex items-center gap-2 p-2 rounded-md bg-muted'>
                                        <div className='flex items-center justify-center w-8 h-8 rounded-full bg-primary/10'>
                                            <Phone className='w-4 h-4 text-primary' />
                                        </div>
                                        <div>
                                            <p className='text-sm font-medium'>{person.name}</p>
                                            <p className='text-xs'>{person.contact}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <h3 className='mb-1 font-semibold'>Created</h3>
                                <p className='text-sm'>{customDateFormatter(selectedPost.created_at)}</p>
                                <p className='text-xs text-muted-foreground'>{formatDistanceToNow(selectedPost.created_at)} ago</p>
                            </div>
                            <div>
                                <h3 className='mb-1 font-semibold'>Last Updated</h3>
                                <p className='text-sm'>{customDateFormatter(selectedPost.updated_at)}</p>
                                <p className='text-xs text-muted-foreground'>{formatDistanceToNow(selectedPost.updated_at)} ago</p>
                            </div>
                        </div>

                        <div className='flex items-center mt-2 space-x-2'>
                            {/* <Switch
                                id='rescue-status'
                                checked={selectedPost.isRescued}
                                onCheckedChange={() => handleToggleRescueStatus(selectedPost._id)}
                            />
                            <Label htmlFor='rescue-status'>{selectedPost.isRescued ? 'Marked as Rescued' : 'Mark as Rescued'}</Label> */}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant='outline'
                            onClick={onClose}>
                            Close
                        </Button>
                        {/* <Button
                            variant={selectedPost.isRescued ? 'outline' : 'default'}
                            onClick={() => handleToggleRescueStatus(selectedPost._id)}>
                            {selectedPost.isRescued ? 'Mark as Pending' : 'Mark as Rescued'}
                        </Button> */}
                    </DialogFooter>
                </DialogContent>
            )}
        </Dialog>
    );
};
