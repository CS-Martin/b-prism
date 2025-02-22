'use client';

import { AppSidebar } from '@b-prism/shadcn-ui/index';
import { SelectedActionType } from '@b-prism/enums';
import Map, { MapMouseEvent, MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState, useMemo } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { useDisplayDispensingPoints, useDisplayWarehouses } from 'apps/web-app/src/hooks/map.hook';
import CreateWarehouseDialog from './_components/warehouse/create-warehouse-dialog';
import RenderWarehouse from './_components/warehouse/render-warehouse';
import DeleteItem from './_components/delete-item';
import CreateDispensingPointDialog from './_components/dispensing-point/create.dispensing-point-dialog';
import ControlPanel from './_components/control-panel';
import RescuePostPanel from './_components/rescue-post-panel';
import RenderDispensingPoint from './_components/dispensing-point/render.dispensing-point';
import { RenderRoadNetwork } from './_components/road-network/render-road-network';
import { useDisplayRoadNetworkByBounds } from '../../hooks/road-network.hook';
import FetchingIndicator from './_components/fetching-indicator';

interface MarkerType {
    longitude: string;
    latitude: string;
}

const MapPage = () => {
    const mapRef = useRef<MapRef | null>(null);

    // Temporary fix *****
    // To solve issue where selectedAction value is always null inside onLoad function of map
    const [selectedAction, setSelectedAction] = useState<SelectedActionType | null>(null);
    const selectedActionRef = useRef<string | null>(selectedAction);

    const { warehouses, fetchAllWarehouses } = useDisplayWarehouses();
    const { dispensingPoints, fetchAllDispensingPoints } = useDisplayDispensingPoints();
    const { roadNetwork, fetchRoadByBounds, isLoading: isFetchingRoadNetwork } = useDisplayRoadNetworkByBounds(mapRef);
    const [isOpen, setIsOpen] = useState(false);
    const [marker, setMarker] = useState<MarkerType>({ longitude: '', latitude: '' });
    const [itemToDelete, setItemtoDelete] = useState<{ type: string; id: string }>();
    // const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [visibility, setVisibility] = useState({
        warehouses: true,
        dispensingPoints: true,
        roadNetwork: true,
    });

    // I cannot fetch all road data (70k data) all at once
    // Had to fetch by data depending on user's bound box map viewport
    useEffect(() => {
        if (!mapRef.current) return;

        const mapboxMap = mapRef.current.getMap();

        const handleMove = () => {
            fetchRoadByBounds();
        };

        mapboxMap.on('moveend', handleMove);

        return () => {
            mapboxMap.off('moveend', handleMove);
        };
    }, [mapRef, fetchRoadByBounds]);

    useEffect(() => {
        selectedActionRef.current = selectedAction;
    }, [selectedAction]);

    // Convert dispensing points into GeoJSON format
    const geoJsonData = useMemo(
        () => ({
            type: 'FeatureCollection',
            DispensingPoint: [
                ...dispensingPoints.map((dp) => ({
                    type: 'Feature',
                    properties: { id: dp.id, type: 'dispensing_point', name: dp.name },
                    geometry: {
                        type: 'Point',
                        coordinates: [Number(dp.longitude), Number(dp.latitude)],
                    },
                })),
            ],
            Warehouse: [
                ...warehouses.map((wh) => ({
                    type: 'Feature',
                    properties: { id: wh.id, type: 'warehouse', name: wh.name },
                    geometry: {
                        type: 'Point',
                        coordinates: [Number(wh.longitude), Number(wh.latitude)],
                    },
                })),
            ],
            RoadNetwork: [
                ...roadNetwork.map((road, index) => ({
                    type: 'Feature',
                    id: index,
                    properties: {
                        id: road.id,
                        is_damaged: road.is_damaged,
                        damage_probability: road.damage_probability,
                        ...road.properties,
                    },
                    geometry: road.geometry,
                })),
            ],
        }),
        [roadNetwork, dispensingPoints, warehouses],
    );

    useEffect(() => {
        if (mapRef.current) {
            const mapboxMap = mapRef.current.getMap();
            const geocoder = new MapboxGeocoder({
                accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN!,
                zoom: 10,
                placeholder: 'Enter coordinates (e.g., -40, 170)',
                reverseGeocode: true,
            });
            mapboxMap.addControl(geocoder);

            const handleLayerClick = (event: MapMouseEvent) => {
                const item = event.features;

                if (!item || item.length === 0) return;

                // Get the details of the clicked item
                const clickedItem = item[0];
                const type = clickedItem.properties?.type;
                const id = clickedItem.properties?.id;

                if (id) {
                    console.log('DELETE');
                    handleMarkerClick(type, id);
                }
            };

            mapboxMap.on('click', 'warehouse_points', handleLayerClick);
            mapboxMap.on('click', 'dispensing_points', handleLayerClick);

            return () => {
                mapboxMap.off('click', 'warehouse_points', handleLayerClick);
                mapboxMap.off('click', 'dispensing_points', handleLayerClick);
            };
        }
    }, [isMapLoaded]);

    // Handles map click events
    const handleMapClick = (event: MapMouseEvent) => {
        const longitude: string = event.lngLat.lng.toString();
        const latitude: string = event.lngLat.lat.toString();

        setMarker({ longitude, latitude });

        if (!selectedAction) {
            setIsOpen(false);
        } else {
            setIsOpen(true);
        }
    };

    // This is for visibility control for cpanel
    // const handleVisibilityChange = (layer: string, isVisible: boolean) => {
    //     setVisibility((prev) => ({ ...prev, [layer]: isVisible }));
    // };

    /**
     * Handles the click event on a marker.
     *
     * @param {string | null} type - The type of the marker (e.g., 'dispensingPoint' or 'warehouse').
     * @param {string | null} id - The ID of the marker.
     *
     */

    const handleMarkerClick = (type: string | null, id: string | null) => {
        if (selectedActionRef.current === 'deleteItem' && type && id) {
            setItemtoDelete({ type, id });
            setIsOpen(true);
        }

        // If selected action isn't 'deleteItem', it is in 'view' state
        // Therefore we must send the ID to view/update component to fetch the corresponding item
        // setSelectedMarkerId(id);
    };

    // if (isFetchingRoadNetwork) return <div>loading</div>;
    return (
        <main>
            <div id='map'>
                <Map
                    ref={mapRef}
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    projection={{ name: 'globe' }}
                    initialViewState={{
                        longitude: 123.700163,
                        latitude: 13.122066,
                        zoom: 9.41,
                        bearing: -38.4,
                        pitch: 75,
                    }}
                    style={{ position: 'absolute', width: '100%', height: '100%' }}
                    mapStyle={'mapbox://styles/cs-martin/cm6ncgu5p007601sg2skp6qpr'}
                    onClick={handleMapClick}
                    onLoad={(e) => {
                        // Load the map first before loading layers
                        setIsMapLoaded(true);
                    }}>
                    {/* Trigger the dialog to create a warehouse */}
                    {selectedAction === 'createWarehouse' && (
                        <CreateWarehouseDialog
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            marker={marker}
                            fetchAllWarehouses={fetchAllWarehouses}
                        />
                    )}

                    {/* Trigger the dialog to create a dispensing point */}
                    {selectedAction === 'createDispensingPoint' && (
                        <CreateDispensingPointDialog
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            marker={marker}
                            fetchAllDispensingPoints={fetchAllDispensingPoints}
                        />
                    )}

                    {isMapLoaded && (
                        <>
                            <RenderRoadNetwork
                                geoJsonData={geoJsonData}
                                isMapLoaded={isMapLoaded}
                                visibility={visibility}
                                fetchRoadByBounds={fetchRoadByBounds}
                            />

                            <RenderWarehouse
                                geoJsonData={geoJsonData}
                                isMapLoaded={isMapLoaded}
                                visibility={visibility}
                                selectedAction={selectedAction}
                            />

                            <RenderDispensingPoint
                                geoJsonData={geoJsonData}
                                isMapLoaded={isMapLoaded}
                                visibility={visibility}
                                selectedAction={selectedAction}
                            />
                        </>
                    )}

                    {/* Control Panel */}
                    <ControlPanel
                        visibility={visibility}
                        onVisibilityChange={(layer, isVisible) => setVisibility((prev) => ({ ...prev, [layer]: isVisible }))}
                    />

                    <RescuePostPanel mapRef={mapRef} />
                    <FetchingIndicator isFetchingRoadNetwork={isFetchingRoadNetwork} />
                </Map>
            </div>
            {isOpen && itemToDelete && (
                <DeleteItem
                    item={itemToDelete}
                    onCancel={() => {
                        setIsOpen(false);
                        setItemtoDelete(undefined);
                    }}
                    fetchAllWarehouses={fetchAllWarehouses}
                    fetchAllDispensingPoints={fetchAllDispensingPoints}
                />
            )}
            <AppSidebar setSelectedAction={(action: string | null) => setSelectedAction(action as SelectedActionType | null)} />
        </main>
    );
};

export default MapPage;
