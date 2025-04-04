import { AuthGuard } from 'libs/backend/app-services/guards-service-lib/src/lib/jwt-auth.guard';
import { RoadNetworkServiceLibService } from '@b-prism/road-network-service-lib';
import { Body, Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('Road Network Endpoints')
@Controller(`${new ConfigService().get('API_VERSION')}/road-networks`)
export class RoadNetworkController {
    constructor(private readonly roadNetworkServiceLibService: RoadNetworkServiceLibService) {}

    @Get('damaged')
    async findAllDamagedRoads() {
        return this.roadNetworkServiceLibService.findAllDamagedRoads();
    }

    @Get('bounds/search')
    async findByBounds(@Query('minLng') minLng: string, @Query('minLat') minLat: string, @Query('maxLng') maxLng: string, @Query('maxLat') maxLat: string) {
        const parsedMinLng = parseFloat(minLng);
        const parsedMinLat = parseFloat(minLat);
        const parsedMaxLng = parseFloat(maxLng);
        const parsedMaxLat = parseFloat(maxLat);

        return this.roadNetworkServiceLibService.findByBounds(parsedMinLng, parsedMinLat, parsedMaxLng, parsedMaxLat);
    }

    @UseGuards(AuthGuard)
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
                severity: {
                    type: 'integer',
                    description: 'The severity level of damaged network.',
                    example: '3 for severely damaged',
                },
                description: {
                    type: 'string',
                    description: 'The reason of damaging the road.',
                    example: '',
                },
                author: {
                    type: 'string',
                    description: 'The name of the person or system performing the action',
                    example: 'John Doe',
                },
            },
            required: ['author'],
        },
    })
    destroyRoad(@Param('id') id: string, @Body() payload: { severity: number; description: string; author: string }) {
        const { severity, description, author } = payload;
        return this.roadNetworkServiceLibService.destroyRoad(id, severity, description, author);
    }

    @UseGuards(AuthGuard)
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
