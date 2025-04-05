'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle2, ChevronDown, Download, Filter, LifeBuoy, MapPin, Phone, Search, SlidersHorizontal, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@b-prism/shadcn-ui/index';
import { Button } from '@b-prism/shadcn-ui/index';
import { Badge } from '@b-prism/shadcn-ui/index';
import { Input } from '@b-prism/shadcn-ui/index';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@b-prism/shadcn-ui/index';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@b-prism/shadcn-ui/index';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@b-prism/shadcn-ui/index';
import { Switch } from '@b-prism/shadcn-ui/index';
import { Label } from '@b-prism/shadcn-ui/index';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@b-prism/shadcn-ui/index';
import { RescueStatisticCards } from './_components/rescue-statistic-cards';

// Mock data based on the provided structure
const mockRescuePosts = [
    {
        _id: '67ee8d35c50e361e35205c85',
        number_of_people_affected: 8,
        isRescued: false,
        created_at: new Date('2025-04-01T11:59:59.000Z'),
        updated_at: new Date('2025-04-02T11:59:59.000Z'),
        demographics: {
            total_adults: 2,
            total_children: 3,
            total_elderly: 3,
        },
        contact_persons: [
            {
                name: 'Carlos Ramos',
                contact: '+63 928 456 7890',
            },
        ],
        location: {
            longitude: 123.1842,
            latitude: 13.1877,
            address: 'Barangay 5, Naga City, Camarines Sur',
            landmark: 'Near SM City Naga',
        },
    },
    {
        _id: '67ee8d35c50e361e35205c86',
        number_of_people_affected: 5,
        isRescued: true,
        created_at: new Date('2025-04-01T10:30:00.000Z'),
        updated_at: new Date('2025-04-02T09:15:00.000Z'),
        demographics: {
            total_adults: 2,
            total_children: 2,
            total_elderly: 1,
        },
        contact_persons: [
            {
                name: 'Maria Santos',
                contact: '+63 917 123 4567',
            },
        ],
        location: {
            longitude: 123.7456,
            latitude: 13.1456,
            address: 'Barangay Concepcion Grande, Naga City',
            landmark: 'Across from Naga City Hospital',
        },
    },
    {
        _id: '67ee8d35c50e361e35205c87',
        number_of_people_affected: 12,
        isRescued: false,
        created_at: new Date('2025-04-02T08:45:00.000Z'),
        updated_at: new Date('2025-04-02T14:20:00.000Z'),
        demographics: {
            total_adults: 5,
            total_children: 4,
            total_elderly: 3,
        },
        contact_persons: [
            {
                name: 'Juan Dela Cruz',
                contact: '+63 939 876 5432',
            },
            {
                name: 'Ana Reyes',
                contact: '+63 927 654 3210',
            },
        ],
        location: {
            longitude: 123.2134,
            latitude: 13.2567,
            address: 'Barangay San Felipe, Naga City',
            landmark: 'Behind Central School',
        },
    },
    {
        _id: '67ee8d35c50e361e35205c88',
        number_of_people_affected: 3,
        isRescued: false,
        created_at: new Date('2025-04-02T12:10:00.000Z'),
        updated_at: new Date('2025-04-02T15:45:00.000Z'),
        demographics: {
            total_adults: 2,
            total_children: 1,
            total_elderly: 0,
        },
        contact_persons: [
            {
                name: 'Elena Bautista',
                contact: '+63 918 765 4321',
            },
        ],
        location: {
            longitude: 123.1945,
            latitude: 13.1789,
            address: 'Barangay Peñafrancia, Naga City',
            landmark: 'Near Peñafrancia Basilica',
        },
    },
    {
        _id: '67ee8d35c50e361e35205c89',
        number_of_people_affected: 7,
        isRescued: false,
        created_at: new Date('2025-04-02T13:25:00.000Z'),
        updated_at: new Date('2025-04-02T16:30:00.000Z'),
        demographics: {
            total_adults: 3,
            total_children: 2,
            total_elderly: 2,
        },
        contact_persons: [
            {
                name: 'Roberto Mendoza',
                contact: '+63 926 543 2109',
            },
        ],
        location: {
            longitude: 123.2056,
            latitude: 13.1654,
            address: 'Barangay Triangulo, Naga City',
            landmark: 'Beside Triangulo Elementary School',
        },
    },
];

export default function RescuePostsDashboard() {
    const [rescuePosts, setRescuePosts] = useState(mockRescuePosts);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'rescued' | 'pending'>('all');
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [postToToggle, setPostToToggle] = useState<string | null>(null);

    // Filter posts based on search query and status filter
    const filteredPosts = rescuePosts.filter((post) => {
        const matchesSearch =
            post.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.contact_persons.some((person) => person.name.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = filterStatus === 'all' || (filterStatus === 'rescued' && post.isRescued) || (filterStatus === 'pending' && !post.isRescued);

        return matchesSearch && matchesStatus;
    });

    // Handle toggling rescue status
    const handleToggleRescueStatus = (postId: string) => {
        setPostToToggle(postId);
        setIsConfirmDialogOpen(true);
    };

    // Confirm rescue status change
    const confirmToggleRescueStatus = () => {
        if (postToToggle) {
            setRescuePosts((posts) => posts.map((post) => (post._id === postToToggle ? { ...post, isRescued: !post.isRescued, updated_at: new Date() } : post)));
            setIsConfirmDialogOpen(false);
            setPostToToggle(null);
        }
    };

    // View post details
    const viewPostDetails = (post: any) => {
        setSelectedPost(post);
        setIsDetailOpen(true);
    };

    // Format date to readable string
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    // Calculate time elapsed since creation
    const getTimeElapsed = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHrs < 1) {
            const diffMins = Math.floor(diffMs / (1000 * 60));
            return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        } else if (diffHrs < 24) {
            return `${diffHrs} hour${diffHrs !== 1 ? 's' : ''} ago`;
        } else {
            const diffDays = Math.floor(diffHrs / 24);
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        }
    };

    return (
        <div className='flex flex-col w-full min-h-screen bg-muted/40'>
            <div className='flex flex-col'>
                <main className='flex-1 p-4 space-y-4 md:p-6'>
                    <RescueStatisticCards />

                    <Tabs
                        defaultValue='table'
                        className='space-y-4'>
                        <TabsList>
                            <TabsTrigger value='table'>Table View</TabsTrigger>
                            <TabsTrigger value='map'>Map View</TabsTrigger>
                        </TabsList>

                        <TabsContent
                            value='table'
                            className='space-y-4'>
                            <div className='flex flex-col gap-4'>
                                <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                                    <div className='flex items-center w-full gap-2 md:w-1/2'>
                                        <Search className='w-4 h-4 text-muted-foreground' />
                                        <Input
                                            placeholder='Search by location or contact name...'
                                            value={searchQuery}
                                            onChange={(e: any) => setSearchQuery(e.target.value)}
                                            className='h-9'
                                        />
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant='outline'
                                                    size='sm'
                                                    className='h-9'>
                                                    <Filter className='w-4 h-4 mr-2' />
                                                    Filter
                                                    <ChevronDown className='w-4 h-4 ml-2' />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align='end'>
                                                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => setFilterStatus('all')}>All Rescue Posts</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setFilterStatus('rescued')}>Rescued</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setFilterStatus('pending')}>Pending Rescue</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            className='h-9'>
                                            <SlidersHorizontal className='w-4 h-4 mr-2' />
                                            Sort
                                        </Button>
                                    </div>
                                </div>

                                <Card>
                                    <CardContent className='p-0'>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className='w-[100px]'>Status</TableHead>
                                                    <TableHead>Location</TableHead>
                                                    <TableHead>People</TableHead>
                                                    <TableHead>Contact</TableHead>
                                                    <TableHead>Created</TableHead>
                                                    <TableHead className='text-right'>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredPosts.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={6}
                                                            className='py-8 text-center text-muted-foreground'>
                                                            No rescue posts found matching your criteria
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    filteredPosts.map((post) => (
                                                        <TableRow key={post._id}>
                                                            <TableCell>
                                                                <Badge
                                                                    variant={post.isRescued ? 'outline' : 'destructive'}
                                                                    className={post.isRescued ? 'border-green-500 text-green-500' : ''}>
                                                                    {post.isRescued ? 'Rescued' : 'Pending'}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className='flex flex-col'>
                                                                    <span className='font-medium truncate max-w-[200px]'>{post.location.address}</span>
                                                                    <span className='text-xs text-muted-foreground truncate max-w-[200px]'>{post.location.landmark}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className='flex items-center gap-1'>
                                                                    <Users className='w-3 h-3 text-muted-foreground' />
                                                                    <span>{post.number_of_people_affected}</span>
                                                                    <span className='ml-1 text-xs text-muted-foreground'>
                                                                        ({post.demographics.total_adults}A, {post.demographics.total_children}C, {post.demographics.total_elderly}E)
                                                                    </span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className='flex flex-col'>
                                                                    <span className='font-medium'>{post.contact_persons[0].name}</span>
                                                                    <span className='text-xs text-muted-foreground'>{post.contact_persons[0].contact}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className='flex flex-col'>
                                                                    <span className='text-xs'>{formatDate(post.created_at)}</span>
                                                                    <span className='text-xs text-muted-foreground'>{getTimeElapsed(post.created_at)}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className='text-right'>
                                                                <div className='flex justify-end gap-2'>
                                                                    <Button
                                                                        variant='ghost'
                                                                        size='sm'
                                                                        onClick={() => viewPostDetails(post)}>
                                                                        View
                                                                    </Button>
                                                                    <Button
                                                                        variant={post.isRescued ? 'outline' : 'default'}
                                                                        size='sm'
                                                                        onClick={() => handleToggleRescueStatus(post._id)}>
                                                                        {post.isRescued ? 'Mark Pending' : 'Mark Rescued'}
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                    <CardFooter className='flex items-center justify-between p-4 border-t'>
                                        <div className='text-xs text-muted-foreground'>
                                            Showing {filteredPosts.length} of {rescuePosts.length} rescue posts
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <Button
                                                variant='outline'
                                                size='sm'
                                                disabled>
                                                Previous
                                            </Button>
                                            <Button
                                                variant='outline'
                                                size='sm'
                                                disabled>
                                                Next
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent
                            value='map'
                            className='space-y-4'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Rescue Posts Map</CardTitle>
                                    <CardDescription>Geographical distribution of rescue requests</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className='h-[500px] rounded-md border bg-muted flex items-center justify-center'>
                                        <div className='text-center'>
                                            <MapPin className='w-12 h-12 mx-auto mb-2 text-muted-foreground' />
                                            <p className='text-sm text-muted-foreground'>Interactive map showing rescue post locations</p>
                                            <p className='mt-1 text-xs text-muted-foreground'>(Mapbox map would be integrated here)</p>
                                            <p className='mt-1 text-xs text-muted-foreground'>Red pins: Pending rescues | Green pins: Completed rescues</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>

            {/* Rescue Post Detail Dialog */}
            <Dialog
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}>
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
                                <Badge
                                    variant={selectedPost.isRescued ? 'outline' : 'destructive'}
                                    className={selectedPost.isRescued ? 'border-green-500 text-green-500' : ''}>
                                    {selectedPost.isRescued ? 'Rescued' : 'Pending Rescue'}
                                </Badge>
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
                                            <span className='font-medium'>{selectedPost.demographics.total_adults}</span>
                                        </div>
                                        <div className='flex flex-col items-center p-1 rounded-md bg-muted'>
                                            <span className='text-xs text-muted-foreground'>Children</span>
                                            <span className='font-medium'>{selectedPost.demographics.total_children}</span>
                                        </div>
                                        <div className='flex flex-col items-center p-1 rounded-md bg-muted'>
                                            <span className='text-xs text-muted-foreground'>Elderly</span>
                                            <span className='font-medium'>{selectedPost.demographics.total_elderly}</span>
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
                                    <p className='text-sm'>{formatDate(selectedPost.created_at)}</p>
                                    <p className='text-xs text-muted-foreground'>{getTimeElapsed(selectedPost.created_at)}</p>
                                </div>
                                <div>
                                    <h3 className='mb-1 font-semibold'>Last Updated</h3>
                                    <p className='text-sm'>{formatDate(selectedPost.updated_at)}</p>
                                    <p className='text-xs text-muted-foreground'>{getTimeElapsed(selectedPost.updated_at)}</p>
                                </div>
                            </div>

                            <div className='flex items-center mt-2 space-x-2'>
                                <Switch
                                    id='rescue-status'
                                    checked={selectedPost.isRescued}
                                    onCheckedChange={() => handleToggleRescueStatus(selectedPost._id)}
                                />
                                <Label htmlFor='rescue-status'>{selectedPost.isRescued ? 'Marked as Rescued' : 'Mark as Rescued'}</Label>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                variant='outline'
                                onClick={() => setIsDetailOpen(false)}>
                                Close
                            </Button>
                            <Button
                                variant={selectedPost.isRescued ? 'outline' : 'default'}
                                onClick={() => handleToggleRescueStatus(selectedPost._id)}>
                                {selectedPost.isRescued ? 'Mark as Pending' : 'Mark as Rescued'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog
                open={isConfirmDialogOpen}
                onOpenChange={setIsConfirmDialogOpen}>
                <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader>
                        <DialogTitle>Confirm Status Change</DialogTitle>
                        <DialogDescription>Are you sure you want to change the rescue status of this post?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className='flex justify-end space-x-2'>
                        <Button
                            variant='outline'
                            onClick={() => setIsConfirmDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={confirmToggleRescueStatus}>Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
