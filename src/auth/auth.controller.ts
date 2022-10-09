import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseModel } from 'src/models/response.models';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';


@Controller('api/auth')
export class AuthController {

    constructor(
        private authService:AuthService,
        private userService:UserService
    ){}
    
    @Post('login')
    @HttpCode(200)
    async login(@Body() body: {username:string;password:string}){
        
        try{
            let response = new ResponseModel();
            const user = await this.authService.authenticate(body.username,body.password);
            response.data = user
            response.code = 200;
            response.message = "Success";
            return response 
        }catch(err){
            throw new BadRequestException(err) 
        }
    }

    @Post('register')
    @HttpCode(200)
    async register(@Body() body:Prisma.UserCreateInput){
        let response = new ResponseModel();
        try{
            response.data = await this.userService.create(body);
            response.code = 200;
            response.message = "Success";
            return response;
        }catch(err){
            throw new BadRequestException(err) 
        }
    }
}
