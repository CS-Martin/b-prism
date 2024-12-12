import { RescuePostServiceLibService } from '@b-prism/rescue-post-service-lib';
import { CreateRescuePostDto } from '@dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Rescue Post Endpoints')
@Controller('rescue-post')
export class RescuePostController {
    constructor(private readonly rescuePostServiceLibService: RescuePostServiceLibService) {}

    @Post('create')
    create(@Body() createRescuePostDto: CreateRescuePostDto) {
        return this.rescuePostServiceLibService.create(createRescuePostDto);
    }

    @Get()
    findAll() {
        return this.rescuePostServiceLibService.findAll();
    }
}
