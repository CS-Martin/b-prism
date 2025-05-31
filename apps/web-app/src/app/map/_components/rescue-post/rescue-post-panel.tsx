import { Label, Separator } from '@b-prism/shadcn-ui/index';
import { MessageSquareMore, PanelRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import mapboxgl from 'mapbox-gl';
import { MapRef } from 'react-map-gl';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { RescuePostCard } from './rescue-post-card';
import { useRescuePostStore } from 'apps/web-app/src/stores/rescue-post-stores/rescue-post.store';
import { RescuePostDto } from '@dto';

const RescuePostPanel = ({ mapRef }: { mapRef: React.RefObject<MapRef> | null }) => {
    const { toast } = useToast();
    const [currentMarker, setCurrentMarker] = useState<mapboxgl.Marker | null>(null);
    const [isExpanded, setIsExpanded] = useState(true);
    const { rescuePosts, fetchAllRescuePosts } = useRescuePostStore();

    useEffect(() => {
        if (!rescuePosts || rescuePosts.length === 0) {
            fetchAllRescuePosts();
        }
    }, []);

    useEffect(() => {
        document.getElementById('scroll-area')?.scrollIntoView({ behavior: 'smooth' });
    }, [rescuePosts]);

    const handleLocateClick = (post: RescuePostDto) => {
        if (!mapRef?.current) return;

        const mapboxMap = mapRef.current.getMap();
        if (!post.location.latitude || !post.location.longitude) {
            toast({ title: `Error`, description: `No coordinates found for ${post.contact_persons[0]?.name || 'post'}` });
            return;
        }

        toast({
            title: `Locating ${post.contact_persons[0]?.name || 'post'}...`,
            description: `Please wait while we locate the post on the map.`,
        });

        mapboxMap.flyTo({ center: [post.location.longitude, post.location.latitude], zoom: 14, essential: true });
        currentMarker?.remove();
        setCurrentMarker(new mapboxgl.Marker().setLngLat([post.location.longitude, post.location.latitude]).addTo(mapboxMap));
    };

    return (
        <Draggable
            handle='.drag-handle'
            cancel='.no-drag'
            bounds='parent'>
            <div
                style={{ touchAction: 'none' }}
                className={`absolute top-[50px] drag-handle right-0 z-50 max-w-[350px] rounded-[10px] shadow-xl m-[20px] bg-black bg-opacity-45 overflow-hidden ${
                    isExpanded ? 'h-[70vh] md:h-[85vh]' : 'h-auto'
                }`}>
                {/* Header */}
                <div className={`cursor-move flex items-center justify-between transition-all duration-500 ${isExpanded ? 'px-5 pt-3.5 mb-3' : 'p-3'}`}>
                    <Label className={`text-[16px] text-white font-semibold ${isExpanded ? '' : 'hidden'}`}>Rescue Posts</Label>
                    <div
                        className='p-0 text-white cursor-pointer pointer-events-auto no-drag'
                        onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? <PanelRight size={18} /> : <MessageSquareMore size={18} />}
                    </div>
                </div>

                {/* Panel Body */}
                {isExpanded && (
                    <div className='flex flex-col h-[calc(100%-50px)] pointer-events-auto no-drag'>
                        <div className='px-5 pb-3.5'>
                            <p className='text-sm text-gray-200'>View and manage rescue posts on the map, sourced from a Facebook Messenger bot.</p>
                        </div>

                        <Separator className='w-full my-3 bg-gray-500' />

                        {/* Scrollable Area */}
                        <div className='flex-1 overflow-y-auto'>
                            <div className='flex flex-col gap-3 p-3'>
                                {rescuePosts.map((post) => (
                                    <RescuePostCard
                                        key={post.id}
                                        post={post}
                                        onLocate={handleLocateClick}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Draggable>
    );
};

export default RescuePostPanel;
