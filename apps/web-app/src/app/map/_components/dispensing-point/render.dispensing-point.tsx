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
 * Renders the dispensing points on the map as layer.
 *
 * @param {Object} props - The properties for the component.
 * @param {any} props.geoJsonData - The GeoJSON data for the dispensing points.
 * @param {boolean} props.isMapLoaded - A flag indicating whether the map is loaded.
 * @param {Object} props.visibility - An object containing visibility settings for different layers.
 * @param {boolean} props.visibility.dispensingPoints - A flag indicating whether the dispensing points layer is visible.
 *
 * @returns {JSX.Element | null} The rendered component or null if the map is not loaded or the dispensing points layer is not visible.
 */
const RenderDispensingPoint = ({ geoJsonData, isMapLoaded, visibility, selectedAction }: RenderDispensingPointProps) => {
    const { current: map } = useMap();

    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState<boolean>(false);
    const [dispensingPointId, setDispensingPointId] = useState<string>('');

    useEffect(() => {
        if (!map || !isMapLoaded) return;

        const handleLayerClick = (event: any) => {
            const dp = event.features;

            if (!dp || dp.length === 0) return;

            const clickedFeature = dp[0];
            const id = clickedFeature.properties?.id;
            console.log(dp, clickedFeature);
            // When null, it means action is default to viewing
            // 'Default' will trigger UpdateDispensingPoint dialog
            if (selectedAction === null) {
                if (id) setDispensingPointId(id);

                setIsUpdateDialogOpen(true);
            } else {
                setIsUpdateDialogOpen(false);
            }
        };

        map.on('click', 'dispensing_points', handleLayerClick);

        return () => {
            map.off('click', 'dispensing_points', handleLayerClick);
        };
    }, [map, isMapLoaded, selectedAction]);

    if (!isMapLoaded || !visibility.dispensingPoints) return null;

    return (
        <>
            <Source
                id='dispensing_points'
                type='geojson'
                data={{
                    type: 'FeatureCollection',
                    features: geoJsonData.features.filter((feature: any) => feature.properties.type === 'dispensing_point'),
                }}
                cluster={true}
                clusterMaxZoom={14}
                clusterRadius={50}>
                <Layer
                    id='clusters'
                    type='circle'
                    source='dispensing_points'
                    filter={['has', 'point_count']}
                    paint={{
                        'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#51bbd6'],
                        'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
                    }}
                />

                <Layer
                    id='cluster-count'
                    type='symbol'
                    source='dispensing_points'
                    filter={['has', 'point_count']}
                    layout={{
                        'text-field': '{point_count_abbreviated}',
                        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                        'text-size': 12,
                    }}
                    paint={{
                        'text-color': '#ffffff',
                    }}
                />

                {/* Individual Points */}
                <Layer
                    id='dispensing_points'
                    type='circle'
                    source='dispensing_points'
                    filter={['!', ['has', 'point_count']]}
                    paint={{
                        'circle-color': '#51bbd6',
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
