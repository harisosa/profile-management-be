import { BadRequestException, Body, Controller, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth/auth.guard';
import { ResponseModel } from 'src/models/response.models';
import { UserModel } from 'src/models/user.models';
import { UserService } from 'src/user/user.service';

@UseGuards(AuthGuard)
@Controller('api/user')
export class UserController {

    constructor(
        private userService:UserService
    ){}
    
    @Get(':id')
    @HttpCode(200)
    async getUser(@Param('id') id: string){
        try{
            let response = new ResponseModel();
            const user = await this.userService.findById(id);
            response.data = user
            response.code = 200;
            response.message = "Success";
            return response 
        }catch(err){
            throw new BadRequestException(err) 
        }
    }

    @Put('update')
    @HttpCode(200)
    async update(@Body() body: UserModel){
        try{
            let response = new ResponseModel();
            let result;
            if(body.password){
                result  = await this.userService.updateByIdWithPassword(body)
            }else{
                result = await this.userService.updateById(body);
            }
            response.code = 200;
            response.message = result;
            return response 
        }catch(err){
            throw new BadRequestException(err) 
        }
    }
}
