import { RoadNetworkDto } from '@dto';
import { RenderDamagedRoads } from './render-damaged-roads';
import { RenderFixedRoads } from './render-fixed-roads';

interface RenderRoadNetworkProps {
    fixedRoadNetworkData: RoadNetworkDto[];
    damagedRoadsData: RoadNetworkDto[];

    fetchFixedRoadsByBounds: () => void;
    fetchDamagedRoads: () => void;
}

export const RenderRoadNetwork = ({ fixedRoadNetworkData, damagedRoadsData, fetchFixedRoadsByBounds, fetchDamagedRoads }: RenderRoadNetworkProps) => {
    return (
        <>
            <RenderFixedRoads
                fixedRoadNetworkData={fixedRoadNetworkData}
                fetchDamagedRoads={fetchDamagedRoads}
            />

            <RenderDamagedRoads damagedRoadsData={damagedRoadsData} />
        </>
    );
};
