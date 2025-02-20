import { Layer, Source } from 'react-map-gl';

interface RenderRoadNetworkProps {
    geoJsonData: any;
    isMapLoaded: boolean;
    visibility: { roadNetwork: boolean };
    selectedAction: string | null;
}

export const RenderRoadNetwork = ({ geoJsonData, isMapLoaded, visibility, selectedAction }: RenderRoadNetworkProps) => {
    if (!isMapLoaded) return null;

    console.log('road network data:', geoJsonData.RoadNetwork);

    return (
        <Source
            id='road-network-source'
            type='geojson'
            data={{ type: 'FeatureCollection', features: [...geoJsonData.RoadNetwork] }}>
            <Layer
                id='road-network-layer'
                type='line'
                paint={{
                    'line-width': 5,
                    'line-color': [
                        'case',
                        ['==', ['get', 'is_damaged'], true],
                        'red', // Red for damaged roads
                        'green',
                    ],
                }}
            />
        </Source>
    );
};
