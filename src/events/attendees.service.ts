import { InjectRepository } from "@nestjs/typeorm";
import { Attendee } from "./attendee.entity";
import { Repository } from "typeorm";
import { Injectable } from '@nestjs/common';
import { CreateAttendeeDto } from './input/create-attendee.dto';

@Injectable()
export class AttendeesService {
    constructor(
        @InjectRepository(Attendee)
        private readonly attendeesRepository: Repository<Attendee>
    ) { }

    public async findByEventId(eventId: number): Promise<Attendee[]> {
        return await this.attendeesRepository.find({ where: { event: { id: eventId } } });
    }

    public async findOneByEventIdAndUserID(eventId: number, userId: number): Promise<Attendee | undefined> {
        return await this.attendeesRepository.findOne(
            { where:{
                event: { id: eventId },
                user: { id: userId }}
            })
    }

    public async createOrUpdate(input:CreateAttendeeDto,eventId:number,userId:number):Promise<Attendee>{
        const attendee = await this.findOneByEventIdAndUserID(eventId,userId)
        ?? new Attendee()

        attendee.eventId = eventId
        attendee.userId = userId
        attendee.answer =input.answer

        return await this.attendeesRepository.save(attendee)
    }
}