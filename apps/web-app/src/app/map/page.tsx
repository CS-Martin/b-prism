'use client';

import { AppSidebar } from '@b-prism/shadcn-ui/index';
import { SelectedActionType } from '@b-prism/enums';

import Map, { MapMouseEvent, MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { useDisplayDispensingPoints, useDisplayWarehouses } from 'apps/web-app/src/hooks/map.hook';
import CreateWarehouseDialog from './_components/warehouse/create-warehouse-dialog';
import RenderWarehouse from './_components/warehouse/render-warehouse';
import DeleteItem from './_components/delete-item';
import CreateDispensingPointDialog from './_components/dispensing_point/create.dispensing-point-dialog';
import RenderDispensingPoint from './_components/dispensing_point/render.dispensing-point';
import ControlPanel from './_components/control-panel';
import RescuePostPanel from './_components/rescue-post-panel';

interface MarkerType {
    longitude: string;
    latitude: string;
}

const MapPage = () => {
    const mapRef = useRef<MapRef | null>(null); // Reference for the map instance

    const { warehouses, fetchAllWarehouses } = useDisplayWarehouses();
    const { dispensingPoints, fetchAllDispensingPoints } = useDisplayDispensingPoints();
    const [selectedAction, setSelectedAction] = useState<SelectedActionType | null>(null);
    const [marker, setMarker] = useState<MarkerType>({ longitude: '', latitude: '' });
    const [isOpen, setIsOpen] = useState(false);
    const [itemToDelete, setItemtoDelete] = useState<{ type: string; id: string }>();
    const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
    const [visibility, setVisibility] = useState({
        warehouses: true,
        dispensingPoints: true,
    });

    // Geocoder function to interpret coordinates
    // const coordinatesGeocoder = (query: string) => {
    //     const matches = query.match(/^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i);
    //     if (!matches) return null;

    //     const coordinateFeature = (lng: number, lat: number) => ({
    //         center: [lng, lat],
    //         geometry: { type: 'Point', coordinates: [lng, lat] },
    //         place_name: `Lat: ${lat}, Lng: ${lng}`,
    //         place_type: ['coordinate'],
    //         properties: {},
    //         type: 'Feature',
    //     });

    //     const coord1 = Number(matches[1]);
    //     const coord2 = Number(matches[2]);
    //     const geocodes = [];

    //     if (coord1 < -90 || coord1 > 90) geocodes.push(coordinateFeature(coord1, coord2));
    //     if (coord2 < -90 || coord2 > 90) geocodes.push(coordinateFeature(coord2, coord1));
    //     if (geocodes.length === 0) {
    //         geocodes.push(coordinateFeature(coord1, coord2));
    //         geocodes.push(coordinateFeature(coord2, coord1));
    //     }

    //     return geocodes;
    // };

    useEffect(() => {
        if (mapRef.current) {
            const mapboxMap = mapRef.current.getMap();

            // Add Geocoder control
            const geocoder = new MapboxGeocoder({
                accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN!,
                zoom: 10,
                placeholder: 'Enter coordinates (e.g., -40, 170)',
                reverseGeocode: true,
            });

            mapboxMap.addControl(geocoder);
        }
    }, []);

    const handleMapClick = (event: MapMouseEvent) => {
        const longitude: string = event.lngLat.lng.toString();
        const latitude: string = event.lngLat.lat.toString();

        setMarker({ longitude, latitude });

        if (!selectedAction) {
            setIsOpen(false);
        } else {
            setIsOpen(true);
        }
    };

    const handleVisibilityChange = (layer: string, isVisible: boolean) => {
        setVisibility((prev) => ({ ...prev, [layer]: isVisible }));
    };

    const handleMarkerClick = (type: string | null, id: string | null) => {
        if (selectedAction === 'deleteItem' && type && id) {
            setItemtoDelete({ type, id });
            setIsOpen(true);
        }

        setSelectedMarkerId(id);
    };

    return (
        <main className=''>
            <div id='map'>
                <Map
                    ref={mapRef}
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    projection={{ name: 'globe' }}
                    initialViewState={{
                        longitude: 123.700163,
                        latitude: 13.122066,
                        zoom: 9.41,
                        bearing: -38.4,
                        pitch: 75,
                    }}
                    style={{ position: 'absolute', width: '100%', height: '100%' }}
                    mapStyle={process.env.NEXT_PUBLIC_MAPBOX_STYLE}
                    onClick={handleMapClick}>
                    {/* Trigger the dialog to create a warehouse */}
                    {selectedAction === 'createWarehouse' && (
                        <CreateWarehouseDialog
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            marker={marker}
                            fetchAllWarehouses={fetchAllWarehouses}
                        />
                    )}

                    {/* Trigger the dialog to create a dispensing point */}
                    {selectedAction === 'createDispensingPoint' && (
                        <CreateDispensingPointDialog
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            marker={marker}
                            fetchAllDispensingPoints={fetchAllDispensingPoints}
                        />
                    )}

                    {visibility.warehouses &&
                        warehouses.map((warehouse, index) => (
                            <RenderWarehouse
                                key={index}
                                warehouse={warehouse}
                                selectedMarkerId={selectedMarkerId}
                                handleMarkerClick={handleMarkerClick}
                                selectedAction={selectedAction}
                            />
                        ))}

                    {/* Conditionally render dispensing points based on visibility */}
                    {visibility.dispensingPoints &&
                        dispensingPoints.map((dispensingPoint, index) => (
                            <RenderDispensingPoint
                                key={index}
                                dispensingPoint={dispensingPoint}
                                selectedMarkerId={selectedMarkerId}
                                handleMarkerClick={handleMarkerClick}
                                selectedAction={selectedAction}
                            />
                        ))}

                    {/* Control the visibility items on the map */}
                    <ControlPanel
                        visibility={visibility}
                        onVisibilityChange={handleVisibilityChange}
                    />

                    <RescuePostPanel mapRef={mapRef} />
                </Map>
            </div>

            {isOpen && itemToDelete && (
                <DeleteItem
                    item={itemToDelete}
                    onCancel={() => setIsOpen(false)}
                    fetchAllWarehouses={fetchAllWarehouses}
                    fetchAllDispensingPoints={fetchAllDispensingPoints}
                />
            )}

            <AppSidebar
                setSelectedAction={(action: string | null) => setSelectedAction(action as SelectedActionType | null)}
            />
        </main>
    );
};

export default MapPage;
