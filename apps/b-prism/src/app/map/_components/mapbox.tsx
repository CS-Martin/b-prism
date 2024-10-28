import Map from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Mapbox = () => {
    return (
        <div id="map">
            <Map
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                projection={{ name: 'globe' }}
                initialViewState={{
                    longitude: 123.700163,
                    latitude: 13.122066,
                    zoom: 9.41,
                    bearing: -38.4,
                    pitch: 75,
                }}
                style={{
                    position: 'absolute',
                    width: '100vw',
                    height: '100vh',
                }}
                mapStyle={process.env.NEXT_PUBLIC_MAPBOX_STYLE}
            />
        </div>
    );
};

export default Mapbox;
