import { Controller,Logger, Get, Post, Put, Delete, Patch, Param, NotFoundException,Body, HttpCode,ParseIntPipe,Res, ValidationPipe ,UsePipes,Query, UseGuards, ForbiddenException} from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { Event } from './event.entity';
import { Repository, MoreThan,Like } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';
import { ListEvents } from './input/list.events';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';

@Controller('/events')
export class EventsController {
    private readonly logger = new Logger(EventsController.name)

    constructor(
        private readonly eventsService:EventsService
    ) { }

    @Get()
    @UsePipes(new ValidationPipe({transform:true}))
    async findAll(@Query() filter:ListEvents) {
        const events = await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(filter,{total:true,currentPage:filter.page,limit:2});
        return events;
    }

    // @Get('/practice')
    // async practice() {
    //     // return await this.repository.find({
    //     //     select:['id','when'],
    //     //     where: [{ 
    //     //         id: MoreThan(3) ,
    //     //         when:MoreThan(new Date('2021-02-12T13:00:00'))
    //     //     },{
    //     //         description:Like('%meet%')
    //     //     }],
    //     //     take:2 ,//LIMIT
    //     //     order:{ //Order By
    //     //         id:'DESC'
    //     //     }
    //     // });
    // }

    
    // @Get('practice2/:id')
    // async  practice2(@Param('id',ParseIntPipe) id){
    // //     // return await this.repository.findOne({where:{id},relations:['attendees']})
    // //     const event = await this.repository.findOne({where:id,relations:['attendees']})

    // //     // const event = new Event()
    // //     // event.id=id

    // //     const attendee = new Attendee();
    // //     attendee.name = 'Using cascade'
    // //    // attendee.event = event

    // //     event.attendees.push(attendee)
    // //     //event.attendees =[]

    // //     // await this.attendeeRepository.save(attendee)
    // //     await this.repository.save(event)

    // //     return event

    // }


    @Get(':id')
    async findOne(@Param('id',ParseIntPipe) id) {
        
       const event = await this.eventsService.getEvent(id)
        if(!event){
            throw new NotFoundException()
        }

        return event
    }


    @Post()
    @UseGuards(AuthGuardJwt)
    async create(@Body() input: CreateEventDto,
    @CurrentUser() user:User
    ) {
       return await this.eventsService.createEvent(input,user)

    }

    @Patch(':id')
    @UseGuards(AuthGuardJwt)
    async update(@Param('id') id, @Body() input: UpdateEventDto,@CurrentUser() user:User) {
        const event = await this.eventsService.getEvent(id)

        if(!event){
            throw new NotFoundException()
        }

        if(event.organizerId !== user.id){
            throw new ForbiddenException(null,`You are not authorized to change this event`)
        }

        return await this.eventsService.updateEvent(event,input)


    }

    @Delete(':id')
    @UseGuards(AuthGuardJwt)
    @HttpCode(204)
    async remove(@Param('id') id,@CurrentUser() user:User) {
        const event = await this.eventsService.getEvent(id)

        if(!event){
            throw new NotFoundException()
        }

        if(event.organizerId !== user.id){
            throw new ForbiddenException(null,`You are not authorized to change this event`)
        }

        await this.eventsService.deleteEvent(id)
  
    }
} 
