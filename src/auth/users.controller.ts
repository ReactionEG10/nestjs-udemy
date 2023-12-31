import { BadRequestException, Body, Controller, Post, SerializeOptions } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./input/create.user.dto";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Controller('users')
@SerializeOptions({strategy:'excludeAll'})
export class UserController{
    constructor(
        private readonly authService:AuthService,
        @InjectRepository(User)
        private readonly userRepository:Repository<User>
    ){}

    @Post()
    async create(@Body() createUserDto:CreateUserDto){
        const user = new User()

        if(createUserDto.password !== createUserDto.retypedPassword){
            throw new BadRequestException(['Passwords are not identical'])
        }

        const existingUser = await this.userRepository.findOne({
            where:[
                {username:createUserDto.username},
                {emial:createUserDto.email}
            ]
        })

        if(existingUser){
            throw new BadRequestException(['username or email is already taken'])
        }

        user.username = createUserDto.username
        user.password = await this.authService.hashPassword(createUserDto.password)
        user.emial = createUserDto.email
        user.firstName = createUserDto.fristname
        user.lastName = createUserDto.lastName

        return{
            ...(await this.userRepository.save(user)),
            token:this.authService.getTokenForUser(user)
        }
    }
}
