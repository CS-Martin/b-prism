'use client';

import Map, { MapMouseEvent } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { useEffect, useState, useCallback } from 'react';
import { useMapActionStore } from 'apps/web-app/src/stores/sidebar-map-action.store';
import CreateWarehouseDialog from './warehouse/create-warehouse-dialog';
import RenderWarehouse from './warehouse/render-warehouse';
import DeleteItem from './delete-item';
import CreateDispensingPointDialog from './dispensing-point/create.dispensing-point-dialog';
import ControlPanel from './control-panel';
import RescuePostPanel from './rescue-post/rescue-post-panel';
import { Session } from 'next-auth';
import { AppSidebar } from 'apps/web-app/src/components/sidebar';
import RenderDispensingPoint from './dispensing-point/render.dispensing-point';
import { RenderRoadNetwork } from './road-network/render-road-network';
import { CoordinatesType } from '@b-prism/types';
import { useMapStore } from 'apps/web-app/src/stores/map-stores/mapbox.store';
import { GenerateDirections } from './directions/generate-directions';
import { useProgress } from '@bprogress/next';
import FetchingIndicator from './fetching-indicator';
import { TyphoonLayer } from './typhoon-simulation/typhoon-layer';

export const MapboxContext = ({ session }: { session: Session | null }) => {
    const { start: startLoad, stop: stopLoad } = useProgress();
    const { mapRef, setMapRef, isMapLoaded, setIsMapLoaded } = useMapStore();

    const selectedAction = useMapActionStore((state) => state.selectedAction);

    const [isOpen, setIsOpen] = useState(false);
    const [coordinates, setCoordinates] = useState<CoordinatesType>({ longitude: 0, latitude: 0 });
    const [itemToDelete, setItemToDelete] = useState<{ type: string; id: string } | null>(null);
    const [visibility, setVisibility] = useState({
        warehouses: true,
        dispensingPoints: true,
        roadNetwork: true,
        route: true,
    });

    if (!isMapLoaded) {
        startLoad();
    } else {
        stopLoad();
    }

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
        if (mapRef?.current && isMapLoaded) {
            const mapboxMap = mapRef.current.getMap();

            // --- Safer check: Ensure layers exist before attaching listeners ---
            const checkAndAttach = (layerId: string, handler: (event: MapMouseEvent) => void) => {
                if (mapboxMap.getLayer(layerId)) {
                    console.log(`Attaching click listener to ${layerId}`);
                    mapboxMap.on('click', layerId, handler);
                } else {
                    console.warn(`Layer ${layerId} not found when trying to attach listener in MapboxContext.`);
                }
            };

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

            checkAndAttach('warehouse_layer', handleLayerClick);
            checkAndAttach('dispensing_point_layer', handleLayerClick);

            return () => {
                if (mapboxMap.getStyle()) {
                    // Check if map still valid
                    try {
                        mapboxMap.off('click', 'warehouse_layer', handleLayerClick);
                        mapboxMap.off('click', 'dispensing_point_layer', handleLayerClick);
                    } catch (e) {
                        console.warn('Error detaching listeners in MapboxContext', e);
                    }
                }
            };
        }
    }, [mapRef, isMapLoaded, handleMarkerClick]);

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
                    ref={(ref) => {
                        if (ref && (!mapRef || mapRef.current !== ref)) {
                            console.log('MapboxContext: Setting mapRef in store');
                            setMapRef({ current: ref });
                        }
                    }}
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    projection={{ name: 'globe' }}
                    initialViewState={{ longitude: 123.700163, latitude: 13.122066, zoom: 9.41, bearing: -38.4, pitch: 75 }}
                    style={{ position: 'absolute', width: '100%', height: '100%' }}
                    mapStyle={process.env.NEXT_PUBLIC_MAPBOX_STYLE}
                    onClick={handleMapClick}
                    onLoad={() => setIsMapLoaded(true)}>
                    {isMapLoaded && (
                        <>
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
                                {selectedAction === 'findRoute' && <GenerateDirections />}

                                <RenderRoadNetwork
                                    visibility={visibility}
                                    session={session}
                                />

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

                                <TyphoonLayer />
                            </>
                            <ControlPanel
                                visibility={visibility}
                                onVisibilityChange={(layer, isVisible) => setVisibility((prev) => ({ ...prev, [layer]: isVisible }))}
                            />

                            <RescuePostPanel mapRef={mapRef} />

                            <FetchingIndicator />
                        </>
                    )}
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
