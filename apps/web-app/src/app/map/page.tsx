'use client';

import { AppSidebar } from '@b-prism/shadcn-ui/index';
import { SelectedActionType } from '@b-prism/enums';

import Map, { MapMouseEvent } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState } from 'react';
import { useDisplayDispensingPoints, useDisplayWarehouses } from 'apps/web-app/src/hooks/map.hook';
import CreateWarehouseDialog from './_components/create-warehouse-dialog';
import RenderWarehouse from './_components/render-warehouse';
import DeleteItem from './_components/delete-item';
import CreateDispensingPointDialog from './_components/create-dispensing-point-dialog';
import RenderDispensingPoint from './_components/render-dispensing-point';
import ControlPanel from './_components/control-panel';

interface MarkerType {
    longitude: string;
    latitude: string;
}

const MapPage = () => {
    // To fetch all warehouses
    const { warehouses, fetchAllWarehouses } = useDisplayWarehouses();

    // To fetch all dispensing points
    const { dispensingPoints, fetchAllDispensingPoints } = useDisplayDispensingPoints();

    // To detect the action selected by the user (create warehouse, delete warehouse, etc.)
    const [selectedAction, setSelectedAction] = useState<SelectedActionType | null>(null);

    // To store the marker coordinates
    const [marker, setMarker] = useState<MarkerType>({ longitude: '', latitude: '' });

    // To open the dialog
    const [isOpen, setIsOpen] = useState(false);

    // To open delete item dialog
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [itemToDelete, setItemtoDelete] = useState<{ type: string; id: string }>();

    // To store the selected marker id
    const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

    const [visibility, setVisibility] = useState({
        warehouses: true,
        dispensingPoints: true,
    });

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
            setIsDeleteDialogOpen(true);
        }
        setSelectedMarkerId(id);
    };

    return (
        <main className=''>
            {/* Control the visibility items on the map */}
            <ControlPanel
                visibility={visibility}
                onVisibilityChange={handleVisibilityChange}
            />

            <div id='map'>
                <Map
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
                    onClick={handleMapClick}
                >
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
                            />
                        ))}
                </Map>
            </div>

            {isDeleteDialogOpen && itemToDelete && (
                <DeleteItem
                    item={itemToDelete}
                    onCancel={() => setIsDeleteDialogOpen(false)}
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
