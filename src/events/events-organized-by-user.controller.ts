import { Controller, Param, Query, SerializeOptions, Get, UseInterceptors, ClassSerializerInterceptor, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events-organized-by-user/:userId')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsOrganizedByUserController {
    constructor(
        private readonly eventsService: EventsService
    ) { }


    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(@Param('userId',ParseIntPipe) userId, @Query('page',new DefaultValuePipe(1),ParseIntPipe) page = 1) {
        return await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(userId, { currentPage: page, limit: 5 })
    }
}