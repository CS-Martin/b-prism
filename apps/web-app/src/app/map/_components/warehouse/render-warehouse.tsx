import { WarehouseDto } from '@dto';
import Image from 'next/image';
import { Marker, Popup } from 'react-map-gl';
import UpdateWarehouseDialog from './update.warehouse-dialog';
import { useState } from 'react';

interface RenderWarehouseProps {
    warehouse: WarehouseDto;
    selectedMarkerId: string | null;
    handleMarkerClick: (type: string | null, id: string | null) => void;
    selectedAction: string | null;
}

const RenderWarehouse = ({ warehouse, selectedMarkerId, handleMarkerClick, selectedAction }: RenderWarehouseProps) => {
    // Local state to manage the dialog's open state
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleMarkerClickAndOpenDialog = (e: any) => {
        e.originalEvent.preventDefault();
        e.originalEvent.stopPropagation();

        handleMarkerClick(warehouse.type, warehouse.id);

        if (selectedAction === 'deleteItem') {
            setIsDialogOpen(false);
        } else {
            setIsDialogOpen(true);
        }
    };

    return (
        <Marker
            longitude={Number(warehouse.longitude)}
            latitude={Number(warehouse.latitude)}
            onClick={handleMarkerClickAndOpenDialog}
            className='cursor-pointer animate-fade-in'>
            <Image
                priority
                src={`/icons/warehouse.icon.svg`}
                alt='warehouse'
                width={50}
                height={50}
                style={{
                    filter: 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))',
                }}
                className='hover:scale-125 transition-all duration-300'
            />
            <p className='text-white text-center'>{warehouse.name}</p>
            {selectedMarkerId === warehouse.id && !selectedAction && (
                <UpdateWarehouseDialog
                    isOpen={isDialogOpen}
                    setIsOpen={setIsDialogOpen}
                    warehouseId={warehouse.id}
                />
            )}
        </Marker>
    );
};

export default RenderWarehouse;
