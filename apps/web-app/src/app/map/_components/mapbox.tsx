import Map, { Marker, MapMouseEvent } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Input,
    Label,
    Textarea,
} from '@b-prism/shadcn-ui/index';
import { CreateWarehouseDto } from '@dto';
import MapDialog from './dialog';
import { useDisplayWarehouses } from 'apps/web-app/src/hooks/map.hook';

interface MarkerType {
    longitude: string;
    latitude: string;
}

const Mapbox = () => {
    const [marker, setMarker] = useState<MarkerType>({ longitude: '', latitude: '' });
    const [isOpen, setIsOpen] = useState(false);

    const { warehouses, isLoading, fetchAllWarehouses } = useDisplayWarehouses();

    console.log(warehouses);

    const handleMapClick = (event: MapMouseEvent) => {
        const longitude: string = event.lngLat.lng.toString();
        const latitude: string = event.lngLat.lat.toString();

        setMarker({ longitude, latitude });

        setIsOpen(true);
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
                style={{ position: 'absolute', width: '100%', height: 'calc(100vh - 28px)' }}
                mapStyle={process.env.NEXT_PUBLIC_MAPBOX_STYLE}
                onClick={handleMapClick}
            >
                <MapDialog
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    marker={marker}
                    fetchAllWarehouses={fetchAllWarehouses}
                />
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
