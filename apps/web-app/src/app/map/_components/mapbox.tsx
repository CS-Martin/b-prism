import Map, { Marker, MapMouseEvent } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState } from 'react';
import { useDisplayWarehouses } from 'apps/web-app/src/hooks/map.hook';
import CreateWarehouseDialog from './create-warehouse-dialog';

interface MarkerType {
    longitude: string;
    latitude: string;
}

type SelectedActionType = 'createWarehouse' | 'createDispensingPoint' | 'deleteItem';

const Mapbox = ({ selectedAction }: { selectedAction: SelectedActionType | null }) => {
    console.log(selectedAction);
    const [marker, setMarker] = useState<MarkerType>({ longitude: '', latitude: '' });
    const [isOpen, setIsOpen] = useState(false);

    const { warehouses, isLoading, fetchAllWarehouses } = useDisplayWarehouses();

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

    return (
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
                {selectedAction === 'createWarehouse' && (
                    <CreateWarehouseDialog
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        marker={marker}
                        fetchAllWarehouses={fetchAllWarehouses}
                    />
                )}
                {warehouses.map((warehouse, index) => (
                    <Marker
                        key={index}
                        longitude={Number(warehouse.longitude)}
                        latitude={Number(warehouse.latitude)}
                    >
                        <div style={{ backgroundColor: 'red', width: '10px', height: '10px', borderRadius: '50%' }} />
                    </Marker>
                ))}
            </Map>
        </div>
    );
};

export default Mapbox;
