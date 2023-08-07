import { Column, Entity, PrimaryGeneratedColumn,OneToMany } from "typeorm";
import { Attendee } from "./attendee.entity";

@Entity()
export class Event{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column()
    description:string;

    @Column()
    when:Date;

    @Column()
    address:string;

    @OneToMany(() => Attendee,(attendee)=> attendee.event,{
        cascade:true
    })
    attendees: Attendee[];
     
    attendeeCount?:number;
    attendeeRejectd?:number
    attendeeMaybe?:number
    attendeeAccepted?:number
}