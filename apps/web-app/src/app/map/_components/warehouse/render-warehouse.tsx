import { Layer, Source, useMap } from 'react-map-gl';
import UpdateWarehouseDialog from './update.warehouse-dialog';
import { useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { useWarehouseStore } from 'apps/web-app/src/stores/map-stores/warehouse.store';

interface RenderWarehouseProps {
    visibility: { warehouses: boolean };
    selectedAction: string | null;
    session?: Session | null;
}

const RenderWarehouse = ({ visibility, selectedAction, session }: RenderWarehouseProps) => {
    const { current: map } = useMap();

    const { warehouseGeoJson, fetchAllWarehouses, isLoading } = useWarehouseStore();

    useEffect(() => {
        if (warehouseGeoJson.features.length === 0) {
            fetchAllWarehouses();
        }
    }, []);

    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState<boolean>(false);
    const [warehouseId, setWarehouseId] = useState<string>('');

    useEffect(() => {
        if (!map) return;

        // Load the image
        const loadImage = async () => {
            try {
                const response = await fetch('/img/warehouse-image.png');

                if (!response.ok) {
                    console.error('Failed to load warehouse image');

                    throw new Error('Failed to load warehouse image');
                }

                const blob = await response.blob();
                const image = await createImageBitmap(blob);

                if (!map.hasImage('warehouse-icon')) {
                    map.addImage('warehouse-icon', image);
                }
            } catch (error) {
                console.error('Error loading warehouse icon');
            }
        };

        loadImage();

        const handleLayerClick = (event: any) => {
            const warehouse = event.features;

            if (!warehouse || warehouse.length === 0) return;

            const clickedWarehouse = warehouse[0];
            const id = clickedWarehouse.properties?.id;

            // When null, it means action is default to viewing
            // 'Default' will trigger UpdateWarehouse dialog
            if (selectedAction === null) {
                if (id) setWarehouseId(id);

                setIsUpdateDialogOpen(true);
            } else {
                setIsUpdateDialogOpen(false);
            }
        };

        map.on('click', 'warehouse_layer', handleLayerClick);

        return () => {
            map.off('click', 'warehouse_layer', handleLayerClick);
        };
    }, [map, selectedAction]);

    if (!visibility.warehouses) return null;

    return (
        <>
            <Source
                id='warehouse'
                type='geojson'
                data={{
                    type: 'FeatureCollection',
                    features: warehouseGeoJson.features,
                }}>
                {/* Individual Points */}
                <Layer
                    id='warehouse_layer'
                    type='symbol'
                    source='warehouse'
                    layout={{
                        'icon-image': 'warehouse-icon',
                        'icon-size': 0.1,
                        'icon-allow-overlap': true,
                        'text-field': ['get', 'name'],
                        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                        'text-size': 12,
                        'text-offset': [0, 1.5],
                        'text-anchor': 'top',
                    }}
                    paint={{
                        'text-color': '#FFFFFF', // Set the text color
                    }}
                />
            </Source>

            {isUpdateDialogOpen && (
                <UpdateWarehouseDialog
                    warehouseId={warehouseId}
                    isOpen={isUpdateDialogOpen}
                    setIsOpen={setIsUpdateDialogOpen}
                    session={session}
                />
            )}
        </>
    );
};

export default RenderWarehouse;
