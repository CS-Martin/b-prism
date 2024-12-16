import { DispensingPointDto } from '@dto';
import Image from 'next/image';
import { Marker } from 'react-map-gl';
import UpdateDispensingPointDialog from './update.dispensing-point-dialog';
import { useState } from 'react';

interface RenderDispensingPointProps {
    dispensingPoint: DispensingPointDto;
    selectedMarkerId: string | null;
    handleMarkerClick: (type: string | null, id: string | null) => void;
    selectedAction: string | null;
}

const RenderDispensingPoint = ({
    dispensingPoint,
    selectedMarkerId,
    handleMarkerClick,
    selectedAction,
}: RenderDispensingPointProps) => {
    // Local state to manage the dialog's open state
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleMarkerClickAndOpenDialog = (e: any) => {
        e.originalEvent.preventDefault();
        e.originalEvent.stopPropagation();

        handleMarkerClick(dispensingPoint.type, dispensingPoint.id);

        if (selectedAction === 'deleteItem') {
            setIsDialogOpen(false);
        } else {
            setIsDialogOpen(true);
        }
    };

    return (
        <>
            <Marker
                longitude={Number(dispensingPoint.longitude)}
                latitude={Number(dispensingPoint.latitude)}
                onClick={handleMarkerClickAndOpenDialog}
                className='cursor-pointer animate-fade-in'>
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
            </Marker>

            {/* Update Dispensing Point Dialog */}
            {selectedMarkerId === dispensingPoint.id && (
                <UpdateDispensingPointDialog
                    isOpen={isDialogOpen}
                    setIsOpen={setIsDialogOpen} // Pass state handler for the dialog
                    dispensingPointId={dispensingPoint.id}
                />
            )}
        </>
    );
};

export default RenderDispensingPoint;
