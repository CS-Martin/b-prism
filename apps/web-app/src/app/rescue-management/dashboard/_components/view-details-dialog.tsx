import { Badge, Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Label, Switch } from '@b-prism/shadcn-ui/index';
import { ContactPersonDto, RescuePostDto } from '@dto';
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
        <Dialog
            open={isViewRescueDetailOpen}
            onOpenChange={onClose}>
            {selectedPost && (
                <DialogContent className='sm:max-w-[600px]'>
                    <DialogHeader className='flex flex-row items-center gap-2 '>
                        <div className='p-2 bg-blue-200 rounded'>
                            <MapPin className='w-6 h-6 text-blue-500' />
                        </div>
                        <DialogTitle className='flex flex-col justify-center gap-1'>
                            Rescue Post Details
                            <Label className='font-normal'>View complete information about this rescue post.</Label>
                        </DialogTitle>
                    </DialogHeader>

                    <div className='grid gap-4 py-4'>
                        <div className='flex items-center gap-2'>
                            <h3 className='font-semibold'>Status</h3>
                            <>
                                {(() => {
                                    switch (selectedPost.status) {
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

                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <h3 className='mb-1 font-semibold'>Location</h3>
                                <p className='text-sm '>{selectedPost.location.address}</p>
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
                                {selectedPost.contact_persons.map((person: ContactPersonDto, index: number) => (
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
                                <p className='text-xs text-muted-foreground'>{formatDistanceToNow(selectedPost.created_at, { addSuffix: true })}</p>
                            </div>
                            <div>
                                <h3 className='mb-1 font-semibold'>Last Updated</h3>
                                <p className='text-sm'>{customDateFormatter(selectedPost.updated_at)}</p>
                                <p className='text-xs text-muted-foreground'>{formatDistanceToNow(selectedPost.updated_at, { addSuffix: true })}</p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant='outline'
                            onClick={onClose}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            )}
        </Dialog>
    );
};
