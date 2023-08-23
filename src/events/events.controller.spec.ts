import { Repository } from "typeorm"
import { EventsController } from "./events.controller"
import { EventsService } from "./events.service"
import { Event } from "./event.entity"
import { ListEvents } from "./input/list.events"
import { User } from "./../auth/user.entity"
import { NotFoundException } from '@nestjs/common';

describe('EventsController',()=>{
    let eventsService:EventsService
    let eventsConteoller:EventsController
    let eventsRepository:Repository<Event>

    // beforeAll(()=>console.log('this logged once'))
    beforeEach(()=>{
        eventsService = new EventsService(eventsRepository)
        eventsConteoller = new EventsController(eventsService)
       
        
    })

    it('should return a list of evebt',async ()=>{
        const result ={
            first:1,
            last:1,
            limit:10,
            data:[]
        }

       // eventsService.getEventsWithAttendeeCountFilteredPaginated= jest.fn().mockImplementation(():any =>result)

        const spy = jest
            .spyOn(eventsService,'getEventsWithAttendeeCountFilteredPaginated')
            .mockImplementation(():any => result)

        expect(await eventsConteoller.findAll(new ListEvents))
            .toEqual(result)
            expect(spy).toBeCalledTimes(1)
    })

    it('should not deleted an event, when it\'s not found', async ()=>{
        const deleteSpy =jest.spyOn(eventsService,'deleteEvent')

        const findSpy = jest.spyOn(eventsService,'findOne')
            .mockImplementation(():any => undefined)

            try{
                await eventsConteoller.remove(1,new User())
            }catch(error){
                expect(error).toBeInstanceOf(NotFoundException)
            }


            expect(deleteSpy).toBeCalledTimes(0)
            expect(findSpy).toHaveBeenCalledTimes(1)
    })

})