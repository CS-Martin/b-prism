import { WarehouseDto } from '@dto';
import { Marker, Popup } from 'react-map-gl';

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
            className='cursor-pointer'
        >
            {selectedMarkerId === warehouse.id && (
                <Popup
                    longitude={Number(warehouse.longitude)}
                    latitude={Number(warehouse.latitude)}
                    onClose={() => handleMarkerClick('', null)}
                    closeOnClick={true}
                    anchor='top'
                    className='text-black text-center'
                >
                    <small>Warehouse:</small>
                    <h3 className='text-lg font-bold'>{warehouse.name}</h3>
                    <p className='text-sm'>Capacity: {warehouse.capacity}</p>
                </Popup>
            )}
        </Marker>
    );
};

export default RenderWarehouse;
