import { Source, Layer } from 'react-map-gl';

interface RenderDispensingPointProps {
    geoJsonData: any;
    isMapLoaded: boolean;
    visibility: { dispensingPoints: boolean };
}

const RenderDispensingPoint = ({ geoJsonData, isMapLoaded, visibility }: RenderDispensingPointProps) => {
    if (!isMapLoaded || !visibility.dispensingPoints) return null;

    return (
        <Source
            id='dispensing_points'
            type='geojson'
            data={geoJsonData}
            cluster={true}
            clusterMaxZoom={14}
            clusterRadius={50}>
            {/* Clustered Points */}
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
    );
};

export default RenderDispensingPoint;
