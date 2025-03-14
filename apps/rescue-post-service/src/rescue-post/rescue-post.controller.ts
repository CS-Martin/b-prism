import { RescuePostServiceLibService } from '@b-prism/rescue-post-service-lib';
import { CreateRescuePostDto } from '@dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Rescue Post Endpoints')
@Controller(`${new ConfigService().get('API_VERSION')}/rescue-posts`)
export class RescuePostController {
    constructor(private readonly rescuePostServiceLibService: RescuePostServiceLibService) {}

    @Post()
    create(@Body() createRescuePostDto: CreateRescuePostDto) {
        return this.rescuePostServiceLibService.create(createRescuePostDto);
    }

    @Get()
    findAll() {
        return this.rescuePostServiceLibService.findAll();
    }
}
