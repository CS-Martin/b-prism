import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
    Label,
    ScrollArea,
    Separator,
} from '@b-prism/shadcn-ui/index';
import { ChevronRight, Locate, MessageSquareMore, PanelRight, ShieldAlert } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { useDisplayRescuePosts } from '../../../hooks/map.hook';
import { formatDistanceToNow } from 'date-fns';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { MapRef } from 'react-map-gl';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';

const RescuePostPanel = ({ mapRef }: { mapRef: React.RefObject<MapRef> }) => {
    const { toast } = useToast();
    const [currentMarker, setCurrentMarker] = useState<any>(null);
    const [isExpanded, setIsExpanded] = useState(true);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { rescuePosts } = useDisplayRescuePosts();

    useEffect(() => {
        scrollAreaRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [rescuePosts]);

    const handleLocateClick = (post: any) => {
        if (!mapRef?.current) return;

        const mapboxMap = mapRef.current.getMap();
        // const geocoder = new MapboxGeocoder({
        //     accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN!,
        //     zoom: 14, // Adjust zoom level as needed
        //     placeholder: 'Search...',
        // });

        // Programmatically trigger a search for the post's address
        // geocoder.query(`${post.latitude}, ${post.longitude}`);

        // Optionally fly to the location using coordinates if available
        if (!post.latitude || !post.longitude) {
            toast({
                title: `Error`,
                description: `No coordinates found for ${post.contact_persons[0].name + ` post` || 'post'}`,
            });
            return;
        }

        toast({
            title: `Locating ${post.contact_persons[0].name + `...` || 'post'}`,
            description: `Please wait while we locate the post on the map.`,
        });

        mapboxMap.flyTo({
            center: [post.longitude, post.latitude],
            zoom: 14,
            essential: true,
        });

        if (currentMarker) {
            currentMarker.remove();
        }

        const newMarker = new mapboxgl.Marker().setLngLat([post.longitude, post.latitude]).addTo(mapboxMap);
        setCurrentMarker(newMarker);
    };

    const renderCollapsibleSection = (title: string, content: JSX.Element) => (
        <Collapsible className='group/collapsible'>
            <CollapsibleTrigger className='w-full'>
                <div className='flex items-center justify-between w-full hover:underline group/label'>
                    <Label className='font-semibold text-[#F4AA55]'>{title}</Label>
                    <ChevronRight
                        size={18}
                        className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90'
                    />
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent className='flex flex-col gap-2 mt-1 px-5 relative'>
                <Separator
                    orientation='vertical'
                    className='absolute top-0 left-2 h-full w-[1px] bg-white bg-opacity-20'
                />
                {content}
            </CollapsibleContent>
        </Collapsible>
    );

    return (
        <>
            <Draggable
                handle='.drag-handle'
                bounds='parent'>
                <div
                    className={`absolute top-[50px] drag-handle right-0 z-50 max-w-[350px] rounded-[10px] shadow-xl m-[20px] bg-black bg-opacity-45 ${
                        isExpanded ? 'md:h-[720px]' : ''
                    }`}>
                    <div
                        className={`cursor-move flex items-center justify-between transition-all duration-300 ${
                            isExpanded ? 'px-5 pt-3.5 mb-3' : 'p-3'
                        }`}>
                        <Label className={`text-[16px] font-semibold ${isExpanded ? '' : 'hidden'}`}>
                            Rescue Posts
                        </Label>
                        <div
                            className='cursor-pointer'
                            onClick={() => setIsExpanded(!isExpanded)}>
                            {isExpanded ? <PanelRight size={18} /> : <MessageSquareMore size={18} />}
                        </div>
                    </div>

                    {isExpanded && (
                        <div className='h-full'>
                            <div className='px-5 pb-3.5'>
                                <p className='text-sm text-gray-500'>
                                    View and manage rescue posts on the map, sourced from a Facebook Messenger bot.
                                </p>
                            </div>
                            <Separator className='my-3 bg-gray-500 w-full' />
                            <ScrollArea className='h-[calc(100%-130px)]'>
                                <div className='flex flex-col gap-3 p-3'>
                                    {rescuePosts.map((post) => (
                                        <div
                                            key={post.id}
                                            className='bg-[#1C1B1B] p-3 rounded-[5px]'
                                            ref={scrollAreaRef}>
                                            <div className='flex justify-between items-center gap-2'>
                                                <span className='flex items-center gap-2'>
                                                    <ShieldAlert
                                                        size={22}
                                                        className='bg-red-500 rounded-full p-[3px]'
                                                    />
                                                    <p className='font-semibold'>
                                                        {new Date(post.createdAt).toLocaleDateString()}{' '}
                                                        <span className='text-xs text-gray-400'>
                                                            | {formatDistanceToNow(new Date(post.createdAt))} ago
                                                        </span>
                                                    </p>
                                                </span>
                                                <button onClick={() => handleLocateClick(post)}>
                                                    <Locate size={18} />
                                                </button>
                                            </div>
                                            <Separator className='my-4 bg-white bg-opacity-20 w-full' />

                                            <div className='flex flex-col gap-2'>
                                                {renderCollapsibleSection(
                                                    'Contact Person/s',
                                                    <>
                                                        {post.contact_persons.map((contact, index) => (
                                                            <div
                                                                key={index}
                                                                className='flex flex-col gap-1'>
                                                                <Label>
                                                                    <span className='font-semibold text-[#F4AA55]'>
                                                                        Name:{' '}
                                                                    </span>
                                                                    {contact.name}
                                                                </Label>
                                                                <Label>
                                                                    <span className='font-semibold text-[#F4AA55]'>
                                                                        Contact:{' '}
                                                                    </span>
                                                                    {contact.contact}
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </>,
                                                )}
                                                {renderCollapsibleSection(
                                                    'Demographics',
                                                    <>
                                                        <Label>
                                                            <span className='font-semibold text-[#F4AA55]'>
                                                                Adult:{' '}
                                                            </span>
                                                            {post.total_adults}
                                                        </Label>
                                                        <Label>
                                                            <span className='font-semibold text-[#F4AA55]'>
                                                                Child:{' '}
                                                            </span>
                                                            {post.total_children}
                                                        </Label>
                                                        <Label>
                                                            <span className='font-semibold text-[#F4AA55]'>
                                                                Elderly:{' '}
                                                            </span>
                                                            {post.total_elderly}
                                                        </Label>
                                                    </>,
                                                )}
                                                <Label>
                                                    <span className='font-semibold text-[#F4AA55]'>Address: </span>
                                                    {post.address}
                                                </Label>
                                                <Label>
                                                    <span className='font-semibold text-[#F4AA55]'>Landmark: </span>
                                                    {post.landmark}
                                                </Label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </div>
            </Draggable>
        </>
    );
};

export default RescuePostPanel;
