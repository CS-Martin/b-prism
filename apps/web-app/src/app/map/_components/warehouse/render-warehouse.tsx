import { WarehouseDto } from '@dto';
import { Layer, Source, useMap } from 'react-map-gl';
import UpdateWarehouseDialog from './update.warehouse-dialog';
import { useEffect, useState } from 'react';

interface RenderWarehouseProps {
    geoJsonData: any;
    isMapLoaded: boolean;
    visibility: { warehouses: boolean };
    selectedAction: string | null;
}

const RenderWarehouse = ({ geoJsonData, isMapLoaded, visibility, selectedAction }: RenderWarehouseProps) => {
    const { current: map } = useMap();

    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState<boolean>(false);
    const [warehouseId, setWarehouseId] = useState<string>('');

    useEffect(() => {
        if (!map || !isMapLoaded) return;

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

        map.on('click', 'warehouse_points', handleLayerClick);

        return () => {
            map.off('click', 'warehouse_points', handleLayerClick);
        };
    }, [map, isMapLoaded, selectedAction]);

    if (!isMapLoaded || !visibility.warehouses) return null;

    return (
        <>
            <Source
                id='warehouse'
                type='geojson'
                data={{ type: 'FeatureCollection', features: geoJsonData.Warehouse }}
                cluster={false}>
                {/* Individual Points */}
                <Layer
                    id='warehouse_points'
                    type='circle'
                    source='warehouse'
                    paint={{
                        'circle-color': '#51bbd6',
                        'circle-radius': 8,
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#fff',
                    }}
                />
            </Source>

            <UpdateWarehouseDialog
                warehouseId={warehouseId}
                isOpen={isUpdateDialogOpen}
                setIsOpen={setIsUpdateDialogOpen}
            />
        </>
    );
};

export default RenderWarehouse;
