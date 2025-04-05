import { RescuePostServiceLibService } from '@b-prism/rescue-post-service-lib';
import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'libs/backend/app-services/guards-service-lib/src/lib/jwt-auth.guard';

@ApiTags('Rescue Post Endpoints')
@Controller(`${new ConfigService().get('API_VERSION')}/rescue-posts`)
export class RescuePostController {
    constructor(private readonly rescuePostServiceLibService: RescuePostServiceLibService) {}

    @Get()
    findAll() {
        return this.rescuePostServiceLibService.findAll();
    }

    @UseGuards(AuthGuard)
    @Put(':id/status')
    updateRescuePostStatus(@Param('id') id: string, @Body() body: { status: 'rescued' | 'pending'; author: string }) {
        if (body.status === 'rescued') {
            return this.rescuePostServiceLibService.updateStatusToRescued(id, body.author);
        } else if (body.status === 'pending') {
            return this.rescuePostServiceLibService.updateStatusToPending(id, body.author);
        }
    }
}
