import { Collapsible, CollapsibleContent, CollapsibleTrigger, Label, ScrollArea, Separator } from '@b-prism/shadcn-ui/index';
import { ChevronRight, Locate, MessageSquareMore, PanelRight, ShieldAlert } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import mapboxgl from 'mapbox-gl';
import { MapRef } from 'react-map-gl';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { RescuePostCard } from './rescue-post-card';
import { useDisplayRescuePosts } from 'apps/web-app/src/hooks/rescue-post.hook';

const RescuePostPanel = ({ mapRef }: { mapRef: React.RefObject<MapRef> | null }) => {
    const { toast } = useToast();
    const [currentMarker, setCurrentMarker] = useState<any>(null);
    const [isExpanded, setIsExpanded] = useState(true);
    const { rescuePosts } = useDisplayRescuePosts();

    useEffect(() => {
        document.getElementById('scroll-area')?.scrollIntoView({ behavior: 'smooth' });
    }, [rescuePosts]);

    const handleLocateClick = (post: any) => {
        if (!mapRef?.current) return;

        const mapboxMap = mapRef.current.getMap();
        if (!post.latitude || !post.longitude) {
            toast({ title: `Error`, description: `No coordinates found for ${post.contact_persons[0]?.name || 'post'}` });
            return;
        }

        toast({
            title: `Locating ${post.contact_persons[0]?.name || 'post'}...`,
            description: `Please wait while we locate the post on the map.`,
        });

        mapboxMap.flyTo({ center: [post.longitude, post.latitude], zoom: 14, essential: true });
        currentMarker?.remove();
        setCurrentMarker(new mapboxgl.Marker().setLngLat([post.longitude, post.latitude]).addTo(mapboxMap));
    };

    return (
        <Draggable
            handle='.drag-handle'
            bounds='parent'>
            <div
                className={`absolute top-[50px] drag-handle right-0 z-50 max-w-[350px] rounded-[10px] shadow-xl m-[20px] bg-black bg-opacity-45 ${isExpanded ? 'md:h-[720px]' : ''}`}>
                <div className={`cursor-move flex items-center justify-between transition-all duration-300 ${isExpanded ? 'px-5 pt-3.5 mb-3' : 'p-3'}`}>
                    <Label className={`text-[16px] text-white font-semibold ${isExpanded ? '' : 'hidden'}`}>Rescue Posts</Label>
                    <div
                        className='text-white cursor-pointer'
                        onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? <PanelRight size={18} /> : <MessageSquareMore size={18} />}
                    </div>
                </div>
                {isExpanded && (
                    <div className='h-full'>
                        <div className='px-5 pb-3.5'>
                            <p className='text-sm text-gray-200'>View and manage rescue posts on the map, sourced from a Facebook Messenger bot.</p>
                        </div>
                        <Separator className='w-full my-3 bg-gray-500' />
                        <ScrollArea
                            className='h-[calc(100%-130px)]'
                            id='scroll-area'>
                            <div className='flex flex-col gap-3 p-3'>
                                {rescuePosts.map((post) => (
                                    <RescuePostCard
                                        key={post.id}
                                        post={post}
                                        onLocate={handleLocateClick}
                                    />
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                )}
            </div>
        </Draggable>
    );
};

export default RescuePostPanel;
