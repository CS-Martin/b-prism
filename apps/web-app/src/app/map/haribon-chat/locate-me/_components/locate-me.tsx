'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button, Separator, Collapsible } from '@b-prism/shadcn-ui/index';
import { ClipboardList, Locate, MapPin } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneLight } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { toast } from '@b-prism/shadcn-ui/hooks/use-toast';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

export const LocateMe = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    const geolocateControlRef = useRef<mapboxgl.GeolocateControl | null>(null);

    const [isLocatingManually, setIsLocatingManually] = useState<boolean>(false);

    const [lng, setLng] = useState<number>(-24);
    const [lat, setLat] = useState<number>(42);

    useEffect(() => {
        if (mapRef.current) return;

        mapboxgl.accessToken = 'pk.eyJ1IjoiY3MtbWFydGluIiwiYSI6ImNtMmdiZGxjZjAwcDEybXE3cTkybnQ0M3EifQ.huD1Ot1QeHQY4gbNjowK_Q';

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current ?? '',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [123.700163, 13.122066],
            zoom: 9.41,
            bearing: -38.4,
            pitch: 75,
        });

        mapRef.current.on('move', () => {
            if (mapRef.current) {
                setLng(Number(mapRef.current.getCenter().lng.toFixed(4)));
                setLat(Number(mapRef.current.getCenter().lat.toFixed(4)));
            }
        });

        const geolocateControl = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true,
            },
            trackUserLocation: true,
            showUserHeading: true,
        });

        // Store the instance in the ref
        geolocateControlRef.current = geolocateControl;

        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            marker: false,
            flyTo: true,
            placeholder: 'Search for locations...',
            proximity: { longitude: 123.700163, latitude: 13.122066 },
            countries: 'PH',
            types: 'place,postcode,address',
            autocomplete: true,
            clearOnBlur: true,
            reverseGeocode: false,
        });
        document.getElementById('search-box')?.appendChild(geocoder.onAdd(mapRef.current));
        // Add the control to the map but hide the default button
        mapRef.current.addControl(geolocateControl);

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, []);

    const handleLocateMe = () => {
        if (geolocateControlRef.current) {
            geolocateControlRef.current.trigger();
        }
    };

    const handleLocateManually = () => {
        setIsLocatingManually(!isLocatingManually);
    };

    const handleCopy = () => {
        navigator.clipboard
            .writeText(codeString)
            .then(() => {
                toast({
                    title: 'Success!',
                    description: 'Coordinates copied successfully.',
                    variant: 'success',
                });
            })
            .catch((error) => {
                console.error('Failed to copy text: ', error);
                toast({
                    title: 'Error!',
                    description: 'Failed to copy coordinates.',
                    variant: 'destructive',
                });
            });
    };

    const codeString = JSON.stringify(
        {
            longitude: lng,
            latitude: lat,
        },
        null,
        2,
    );

    return (
        <div
            id='map'
            ref={mapContainerRef}
            style={{ position: 'absolute', width: '100%', height: '100%' }}>
            {/* I want a button to trigger GeolocateControl */}

            {isLocatingManually && (
                <div className='absolute z-50 transform -translate-x-1/2 -translate-y-[135%] top-1/2 left-1/2'>
                    {/* Black Circle */}
                    <div className='relative flex items-center justify-center animate-bounce'>
                        <div className='p-2 bg-blue-500 rounded-full'>
                            <MapPin />
                        </div>
                        {/* Small Point (Pin Tail) */}
                        <div className='absolute bottom-0 w-3 h-3 translate-y-1/2 bg-blue-500 rounded-full'></div>
                        <div className='absolute bottom-0 w-1 h-1 translate-y-[15px] bg-blue-500 rounded-full'></div>
                    </div>
                </div>
            )}

            <div
                className='absolute top-5 w-[95vw] sm:w-[350px] z-50 -translate-x-1/2 left-1/2'
                id='search-box'></div>

            <div className='absolute z-50 transform w-[95vw] sm:w-[350px] -translate-x-1/2 bottom-5 left-1/2'>
                <div className='flex items-center w-full gap-2 mb-2 transition-colors duration-200 bg-white rounded-lg shadow-xl cursor-pointer'>
                    <div
                        className='relative w-full py-2 rounded-lg hover:bg-black/30'
                        onClick={handleCopy}>
                        <pre className='rounded-lg '>
                            <SyntaxHighlighter
                                language='json'
                                style={atomOneLight}
                                customStyle={{ backgroundColor: 'transparent', padding: '0 1rem' }}>
                                {codeString}
                            </SyntaxHighlighter>
                        </pre>

                        {/* Copy Button */}
                        <div className='absolute flex items-center p-1 space-x-1 border border-gray-400 rounded-md top-2 right-2'>
                            <ClipboardList
                                height={16}
                                width={16}
                                className='text-gray-700 cursor-pointer'
                            />
                            <span className='text-xs text-gray-700 cursor-pointer '>Copy</span>
                        </div>
                    </div>
                </div>

                <div className='relative p-2 overflow-hidden bg-white rounded-lg shadow-xl'>
                    <Button
                        onClick={handleLocateMe}
                        className='w-1/2 font-normal bg-white hover:bg-blue-500 hover:text-white'>
                        <Locate
                            height={24}
                            width={24}
                        />
                        Locate me
                    </Button>
                    <Button
                        className={`${isLocatingManually ? 'bg-blue-500 text-white' : 'bg-white'} w-1/2 hover:bg-blue-500 hover:text-white`}
                        onClick={handleLocateManually}>
                        <MapPin
                            height={24}
                            width={24}
                        />
                        Locate Manually
                    </Button>
                </div>
            </div>
        </div>
    );
};
