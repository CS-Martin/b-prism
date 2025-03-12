'use client';

import { SelectedActionType } from '@b-prism/enums';
import Map, { MapMouseEvent, MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { useDisplayWarehouses } from 'apps/web-app/src/hooks/map.hook';
import { useMapActionStore } from 'apps/web-app/src/stores/sidebar-map-action.store';
import CreateWarehouseDialog from './warehouse/create-warehouse-dialog';
import RenderWarehouse from './warehouse/render-warehouse';
import DeleteItem from './delete-item';
import CreateDispensingPointDialog from './dispensing-point/create.dispensing-point-dialog';
import ControlPanel from './control-panel';
import RescuePostPanel from './rescue-post/rescue-post-panel';
import FetchingIndicator from './fetching-indicator';
import { Session } from 'next-auth';
import { useDisplayDispensingPoints } from 'apps/web-app/src/hooks/dispensing-point.hook';
import { GenerateDirections } from './directions/generate-directions';
import { AppSidebar } from 'apps/web-app/src/components/sidebar';
import RenderDispensingPoint from './dispensing-point/render.dispensing-point';
import { RenderRoadNetwork } from './road-network/render-road-network';
import { useDisplayDamagedRoads, useDisplayFixedRoadNetworkByBounds } from 'apps/web-app/src/hooks/road-network.hook';
import { CoordinatesType } from '@b-prism/types';
import { useMapStore } from 'apps/web-app/src/stores/map-stores/mapbox.store';
import { useDispensingPointsStore } from 'apps/web-app/src/stores/map-stores/dispensing-point.store';

export const MapboxContext = ({ session }: { session: Session | null }) => {
    const mapRef = useRef<MapRef | null>(null);

    const selectedAction = useMapActionStore((state) => state.selectedAction);

    const { fixedRoadNetwork, fetchFixedRoadsByBounds, isLoading: isFetchingRoadNetwork } = useDisplayFixedRoadNetworkByBounds(mapRef);
    const { damagedRoads, fetchDamagedRoads } = useDisplayDamagedRoads();

    const [isOpen, setIsOpen] = useState(false);
    const [coordinates, setCoordinates] = useState<CoordinatesType>({ longitude: 0, latitude: 0 });
    const [itemToDelete, setItemToDelete] = useState<{ type: string; id: string } | null>(null);
    const [visibility, setVisibility] = useState({
        warehouses: true,
        dispensingPoints: true,
        roadNetwork: true,
        route: true,
    });

    const handleMarkerClick = useCallback(
        (type: string | null, id: string | null) => {
            if (selectedAction === 'deleteItem' && type && id) {
                setItemToDelete({ type, id });
                setIsOpen(true);
            }
        },
        [selectedAction],
    );

    useEffect(() => {
        if (mapRef.current) {
            const mapboxMap = mapRef.current.getMap();

            const handleLayerClick = (event: MapMouseEvent) => {
                const item = event.features;

                if (!item || item.length === 0) return;

                // Get the details of the clicked item
                const clickedItem = item[0];
                const type = clickedItem.properties?.type;
                const id = clickedItem.properties?.id;

                if (id) {
                    handleMarkerClick(type, id);
                }
            };

            mapboxMap.on('click', 'warehouse_layer', handleLayerClick);
            mapboxMap.on('click', 'dispensing_point_layer', handleLayerClick);

            return () => {
                mapboxMap.off('click', 'warehouse_layer', handleLayerClick);
                mapboxMap.off('click', 'dispensing_point_layer', handleLayerClick);
            };
        }
    }, [handleMarkerClick]);

    const handleMapClick = (event: MapMouseEvent) => {
        setCoordinates({
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat,
        });

        if (!selectedAction) {
            setIsOpen(false);
        } else {
            setIsOpen(true);
        }
    };

    return (
        <main>
            <div id='map'>
                <Map
                    ref={mapRef}
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    projection={{ name: 'globe' }}
                    initialViewState={{ longitude: 123.700163, latitude: 13.122066, zoom: 9.41, bearing: -38.4, pitch: 75 }}
                    style={{ position: 'absolute', width: '100%', height: '100%' }}
                    mapStyle={process.env.NEXT_PUBLIC_MAPBOX_STYLE}
                    onClick={handleMapClick}>
                    {selectedAction === 'createWarehouse' && (
                        <CreateWarehouseDialog
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            coordinates={coordinates}
                            session={session}
                        />
                    )}
                    {selectedAction === 'createDispensingPoint' && (
                        <CreateDispensingPointDialog
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            coordinates={coordinates}
                            session={session}
                        />
                    )}

                    <>
                        {/* {selectedAction === 'findRoute' && <GenerateDirections damagedRoads={damagedRoads} />}
                            <RenderRoadNetwork
                                fixedRoadNetworkData={fixedRoadNetwork}
                                fetchFixedRoadsByBounds={fetchFixedRoadsByBounds}
                                damagedRoadsData={damagedRoads}
                                fetchDamagedRoads={fetchDamagedRoads}
                                visibility={visibility}
                            /> */}
                        <RenderWarehouse
                            visibility={visibility}
                            selectedAction={selectedAction}
                            session={session}
                        />
                        <RenderDispensingPoint
                            visibility={visibility}
                            selectedAction={selectedAction}
                            session={session}
                        />
                    </>
                    {/* <ControlPanel
                        visibility={visibility}
                        onVisibilityChange={(layer, isVisible) => setVisibility((prev) => ({ ...prev, [layer]: isVisible }))}
                    />
                    <RescuePostPanel mapRef={mapRef} />
                    <FetchingIndicator isFetchingRoadNetwork={isFetchingRoadNetwork} /> */}
                </Map>
            </div>

            {isOpen && itemToDelete && (
                <DeleteItem
                    item={itemToDelete}
                    onCancel={() => {
                        setIsOpen(false);
                        setItemToDelete(null);
                    }}
                    session={session}
                />
            )}

            <AppSidebar />
        </main>
    );
};
