'use client';

import { SelectedActionType } from '@b-prism/enums';
import Map, { MapMouseEvent, MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState, useMemo } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { useDisplayWarehouses } from 'apps/web-app/src/hooks/map.hook';
import CreateWarehouseDialog from './warehouse/create-warehouse-dialog';
import RenderWarehouse from './warehouse/render-warehouse';
import DeleteItem from './delete-item';
import CreateDispensingPointDialog from './dispensing-point/create.dispensing-point-dialog';
import ControlPanel from './control-panel';
import RescuePostPanel from './rescue-post/rescue-post-panel';
import RenderDispensingPoint from './dispensing-point/render.dispensing-point';
import { RenderRoadNetwork } from './road-network/render-road-network';
import { useDisplayDamagedRoads, useDisplayFixedRoadNetworkByBounds } from '../../../hooks/road-network.hook';
import FetchingIndicator from './fetching-indicator';
import { TyphoonLayer } from './typhoon-simulation/typhoon-layer';
import { AppSidebar } from 'apps/web-app/src/components/sidebar';
import { Session } from 'next-auth';
import { useDisplayDispensingPoints } from 'apps/web-app/src/hooks/dispensing-point.hook';

interface MarkerType {
    longitude: string;
    latitude: string;
}

export const MapboxContext = ({ session }: { session: Session | null }) => {
    const mapRef = useRef<MapRef | null>(null);

    // Temporary fix *****
    // To solve issue where selectedAction value is always null inside onLoad function of map
    const [selectedAction, setSelectedAction] = useState<SelectedActionType | null>(null);
    const selectedActionRef = useRef<string | null>(selectedAction);

    const { fixedRoadNetwork, fetchFixedRoadsByBounds, isLoading: isFetchingRoadNetwork } = useDisplayFixedRoadNetworkByBounds(mapRef);
    const { damagedRoads, fetchDamagedRoads, isLoading: isFetchingDamagedRoads } = useDisplayDamagedRoads();

    const { warehouses, fetchAllWarehouses } = useDisplayWarehouses();
    const { dispensingPoints, fetchAllDispensingPoints } = useDisplayDispensingPoints();
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

    useEffect(() => {
        selectedActionRef.current = selectedAction;
    }, [selectedAction]);

    // Convert dispensing points into GeoJSON format
    const geoJsonData = useMemo(
        () => ({
            type: 'FeatureCollection',
            features: [
                ...dispensingPoints.map((dp) => ({
                    type: 'Feature',
                    properties: { id: dp.id, type: 'dispensing_point', name: dp.name },
                    geometry: { type: 'Point', coordinates: [Number(dp.longitude), Number(dp.latitude)] },
                })),
                ...warehouses.map((wh) => ({
                    type: 'Feature',
                    properties: { id: wh.id, type: 'warehouse', name: wh.name },
                    geometry: { type: 'Point', coordinates: [Number(wh.longitude), Number(wh.latitude)] },
                })),
            ],
        }),
        [dispensingPoints, warehouses],
    );

    useEffect(() => {
        if (mapRef.current) {
            const mapboxMap = mapRef.current.getMap();
            // const geocoder = new MapboxGeocoder({
            //     accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN!,
            //     zoom: 10,
            //     placeholder: 'Enter coordinates (e.g., -40, 170)',
            //     reverseGeocode: true,
            // });
            // mapboxMap.addControl(geocoder);

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
                        fetchFixedRoadsByBounds();
                        fetchDamagedRoads();
                    }}>
                    {/* Trigger the dialog to create a warehouse */}
                    {selectedAction === 'createWarehouse' && (
                        <CreateWarehouseDialog
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            marker={marker}
                            fetchAllWarehouses={fetchAllWarehouses}
                            session={session}
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
                            <TyphoonLayer />
                            <RenderRoadNetwork
                                fixedRoadNetworkData={fixedRoadNetwork}
                                fetchFixedRoadsByBounds={fetchFixedRoadsByBounds}
                                damagedRoadsData={damagedRoads}
                                fetchDamagedRoads={fetchDamagedRoads}
                                isMapLoaded={isMapLoaded}
                                visibility={visibility}
                            />

                            <RenderWarehouse
                                geoJsonData={geoJsonData}
                                isMapLoaded={isMapLoaded}
                                visibility={visibility}
                                selectedAction={selectedAction}
                                session={session}
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
                    session={session}
                />
            )}
            <AppSidebar setSelectedAction={(action: string | null) => setSelectedAction(action as SelectedActionType | null)} />
        </main>
    );
};
