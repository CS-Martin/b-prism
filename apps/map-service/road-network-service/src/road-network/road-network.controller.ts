import { RoadNetworkServiceLibService } from '@b-prism/road-network-service-lib';
import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Road Network Endpoints')
@Controller('road-network')
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

    @Put('destroy-road/:id')
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

    @Put('fix-road/:id')
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
    fixRoad(@Param('id') id: string, @Body() payload: { author: string }) {
        const { author } = payload;

        return this.roadNetworkServiceLibService.fixRoad(id, author);
    }

    @Get('bounds/search')
    async findByBounds(@Query('minLng') minLng: string, @Query('minLat') minLat: string, @Query('maxLng') maxLng: string, @Query('maxLat') maxLat: string) {
        const parsedMinLng = parseFloat(minLng);
        const parsedMinLat = parseFloat(minLat);
        const parsedMaxLng = parseFloat(maxLng);
        const parsedMaxLat = parseFloat(maxLat);

        return this.roadNetworkServiceLibService.findByBounds(parsedMinLng, parsedMinLat, parsedMaxLng, parsedMaxLat);
    }

    @Get('damaged-roads/all')
    async findAllDamagedRoads() {
        return this.roadNetworkServiceLibService.findAllDamagedRoads();
    }
}
