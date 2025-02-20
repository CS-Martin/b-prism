import { RoadNetworkServiceLibService } from '@b-prism/road-network-service-lib';
import { Body, Controller, Get, Param, Put } from '@nestjs/common';
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

        return this.roadNetworkServiceLibService.destroyRoad(id, author);
    }
}
