import { RoadNetworkServiceLibService } from '@b-prism/road-network-service-lib';
import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('Road Network Endpoints')
@Controller(`${new ConfigService().get('API_VERSION')}/road-networks`)
export class RoadNetworkController {
    constructor(private readonly roadNetworkServiceLibService: RoadNetworkServiceLibService) {}

    @Get()
    findAll() {
        return this.roadNetworkServiceLibService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.roadNetworkServiceLibService.findById(id);
    }

    @Get('search-by-bounds')
    @ApiParam({
        name: 'minLng',
        type: String,
        description: 'The minimum longitude of the bounding box',
    })
    @ApiParam({
        name: 'minLat',
        type: String,
        description: 'The minimum latitude of the bounding box',
    })
    @ApiParam({
        name: 'maxLng',
        type: String,
        description: 'The maximum longitude of the bounding box',
    })
    @ApiParam({
        name: 'maxLat',
        type: String,
        description: 'The maximum latitude of the bounding box',
    })
    async findByBounds(@Query('minLng') minLng: string, @Query('minLat') minLat: string, @Query('maxLng') maxLng: string, @Query('maxLat') maxLat: string) {
        const parsedMinLng = parseFloat(minLng);
        const parsedMinLat = parseFloat(minLat);
        const parsedMaxLng = parseFloat(maxLng);
        const parsedMaxLat = parseFloat(maxLat);

        return this.roadNetworkServiceLibService.findByBounds(parsedMinLng, parsedMinLat, parsedMaxLng, parsedMaxLat);
    }

    @Get('damaged')
    async findAllDamagedRoads() {
        return this.roadNetworkServiceLibService.findAllDamagedRoads();
    }

    @Put(':id/destroy')
    @ApiParam({
        name: 'id',
        type: String,
        description: 'The ID of the road to destroy',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                author: {
                    type: 'string',
                    description: 'The name of the person or system performing the action',
                    example: 'John Doe',
                },
            },
            required: ['author'],
        },
    })
    destroyRoad(@Param('id') id: string, @Body() payload: { author: string }) {
        const { author } = payload;
        return this.roadNetworkServiceLibService.destroyRoad(id, author);
    }

    @Put(':id/fix')
    @ApiParam({
        name: 'id',
        type: String,
        description: 'The ID of the road to fix',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                author: {
                    type: 'string',
                    description: 'The name of the person or system performing the action',
                    example: 'John Doe',
                },
            },
            required: ['author'],
        },
    })
    fixRoad(@Param('id') id: string, @Body() payload: { author: string }) {
        const { author } = payload;
        return this.roadNetworkServiceLibService.fixRoad(id, author);
    }
}
