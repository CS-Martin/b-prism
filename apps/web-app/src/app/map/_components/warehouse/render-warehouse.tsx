import { WarehouseDto } from '@dto';
import Image from 'next/image';
import { Marker, Popup } from 'react-map-gl';
import UpdateWarehouseDialog from './update.warehouse-dialog';

interface RenderWarehouseProps {
    warehouse: WarehouseDto;
    selectedMarkerId: string | null;
    handleMarkerClick: (type: string | null, id: string | null) => void;
}

const RenderWarehouse = ({ warehouse, selectedMarkerId, handleMarkerClick }: RenderWarehouseProps) => {
    return (
        <Marker
            longitude={Number(warehouse.longitude)}
            latitude={Number(warehouse.latitude)}
            onClick={(e) => {
                e.originalEvent.preventDefault();
                e.originalEvent.stopPropagation();
                handleMarkerClick(warehouse.type, warehouse.id);
            }}
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
            {selectedMarkerId === warehouse.id && (
                <UpdateWarehouseDialog
                    isOpen={isDialogOpen}
                    setIsOpen={setIsDialogOpen} // Pass state handler for the dialog
                    warehouseId={warehouse.id}
                />
            )}
        </Marker>
    );
};

export default RenderWarehouse;
