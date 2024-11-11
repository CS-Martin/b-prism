import { DispensingPointDto, WarehouseDto } from '@dto';
import Image from 'next/image';
import { Marker, Popup } from 'react-map-gl';

interface RenderDispensingPointProps {
    dispensingPoint: DispensingPointDto;
    selectedMarkerId: string | null;
    handleMarkerClick: (type: string | null, id: string | null) => void;
}

const RenderDispensingPoint = ({
    dispensingPoint,
    selectedMarkerId,
    handleMarkerClick,
}: RenderDispensingPointProps) => {
    return (
        <Marker
            longitude={Number(dispensingPoint.longitude)}
            latitude={Number(dispensingPoint.latitude)}
            onClick={(e) => {
                e.originalEvent.preventDefault();
                e.originalEvent.stopPropagation();
                handleMarkerClick(dispensingPoint.type, dispensingPoint.id);
            }}
            className='cursor-pointer'
        >
            <Image
                priority
                src={`/icons/dispensing-point.icon.svg`}
                alt='dispensing point'
                width={24}
                height={24}
                style={{
                    filter: 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))',
                }}
                className='hover:scale-150 transition-all duration-300 hover:bg-blue-500 hover:bg-opacity-50 rounded-full'
            />
            <p className='text-white text-center'>{dispensingPoint.name}</p>
            {selectedMarkerId === dispensingPoint.id && (
                <Popup
                    longitude={Number(dispensingPoint.longitude)}
                    latitude={Number(dispensingPoint.latitude)}
                    onClose={() => handleMarkerClick('', null)}
                    closeOnClick={true}
                    anchor='top'
                    className='text-black text-center'
                >
                    <small>Warehouse:</small>
                    <h3 className='text-lg font-bold'>{dispensingPoint.name}</h3>
                    <p className='text-sm'>Capacity: {dispensingPoint.capacity}</p>
                </Popup>
            )}
        </Marker>
    );
};

export default RenderDispensingPoint;
