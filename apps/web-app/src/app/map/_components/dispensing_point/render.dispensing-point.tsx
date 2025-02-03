import { useEffect, useState } from 'react';
import { Source, Layer, useMap } from 'react-map-gl';
import UpdateDispensingPointDialog from './update.dispensing-point-dialog';

interface RenderDispensingPointProps {
    geoJsonData: any;
    isMapLoaded: boolean;
    visibility: { dispensingPoints: boolean };
    selectedAction: string | null;
}

/**
 * Renders the Dispensing Point layer and handles click events.
 */
const RenderDispensingPoint = ({ geoJsonData, isMapLoaded, visibility, selectedAction }: RenderDispensingPointProps) => {
    const { current: map } = useMap();

    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [dispensingPointId, setDispensingPointId] = useState('');

    useEffect(() => {
        if (!map || !isMapLoaded) return;

        const handleLayerClick = (event: any) => {
            const dp = event.features;

            if (!dp || dp.length === 0) return;

            const clickedFeature = dp[0];
            const id = clickedFeature.properties?.id;

            console.log('HAHHA', selectedAction);

            if (selectedAction === null) {
                console.log('TEST1', selectedAction);
                setIsUpdateDialogOpen(true);
            } else {
                console.log('TEST', selectedAction);
                setIsUpdateDialogOpen(false);
            }

            if (id) {
                setDispensingPointId(id);
            }
        };

        map.on('click', 'unclustered_points', handleLayerClick);

        return () => {
            map.off('click', 'unclustered_points', handleLayerClick);
        };
    }, [map, isMapLoaded, selectedAction]);

    if (!isMapLoaded || !visibility.dispensingPoints) return null;

    return (
        <>
            <Source
                id='dispensing_points'
                type='geojson'
                data={geoJsonData}
                cluster={true}
                clusterMaxZoom={14}
                clusterRadius={50}>
                <Layer
                    id='clusters'
                    type='circle'
                    source='dispensing_points'
                    filter={['has', 'point_count']}
                    paint={{
                        'circle-color': '#2196F3',
                        'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 50, 40],
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#fff',
                    }}
                />

                {/* Individual Points */}
                <Layer
                    id='unclustered_points'
                    type='circle'
                    source='dispensing_points'
                    filter={['!', ['has', 'point_count']]}
                    paint={{
                        'circle-color': '#FF5722',
                        'circle-radius': 8,
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#fff',
                    }}
                />
            </Source>

            <UpdateDispensingPointDialog
                dispensingPointId={dispensingPointId}
                isOpen={isUpdateDialogOpen}
                setIsOpen={setIsUpdateDialogOpen}
            />
        </>
    );
};

export default RenderDispensingPoint;
