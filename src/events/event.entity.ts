import { Column, Entity, PrimaryGeneratedColumn,OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Attendee } from "./attendee.entity";
import { User } from "./../auth/user.entity";
import { Expose } from "class-transformer";
import { PaginationResult } from "./../pagination/pagiantor";

@Entity()
export class Event{
    constructor(partial:Partial<Event>){
        Object.assign(this,partial)
    }

    @PrimaryGeneratedColumn()
    @Expose()
    id:number;

    @Column()
    @Expose()
    name:string;

    @Column()
    @Expose()
    description:string;

    @Column()
    @Expose()
    when:Date;

    @Column()
    @Expose()
    address:string;

    @OneToMany(() => Attendee,(attendee)=> attendee.event,{
        cascade:true
    })
    @Expose()
    attendees: Attendee[];

    @ManyToOne(()=>User,(user)=>user.organized)
    @JoinColumn({name:'organizerId'})
    @Expose()
    organizer:User

    @Column({nullable:true})
    organizerId:number

    @Expose()
    attendeeCount?:number;
    @Expose()
    attendeeRejectd?:number
    @Expose()
    attendeeMaybe?:number
    @Expose()
    attendeeAccepted?:number
}

export type PaginatedEvents = PaginationResult<Event>