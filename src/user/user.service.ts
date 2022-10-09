import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { UserModel } from 'src/models/user.models';

const SALT_PASSWORD = 16;

@Injectable()
export class UserService {
    constructor(private prismaClient : PrismaService){}

    async create(user:Prisma.UserCreateInput){
        if(user.password){
            user.password = await bcrypt.hash(user.password,SALT_PASSWORD)
        }
        try{
            const userData = await this.prismaClient.user.create({
                data:user,
            })
    
            delete userData.password;
            return userData;
        }catch(err){
            throw new CreateNewUserException();
        }

    }

    async findOne(user:{email? :string;phone?:string;}){
        const userData = await this.prismaClient.user.findUnique({
            where: user,
        })

        if (!userData) return null;

        return userData;
    }
    async findById(id :string){
        const userData = await this.prismaClient.user.findUnique({
            where: {
                id : id
            },
        })
        
        if (!userData) throw new UserNotFoundException();
        delete userData.password;
        
        return userData;
    }

    async updateById(user : UserModel){
        const updateUser = await this.prismaClient.user.update({
            where: {
              id: user.id,
            },
            data: {
              fullname: user.fullname,
              phone: user.phone
            },
          })
          if(!updateUser) throw new UpdateUserException();

          return "update user sucessful"
    }

    async updateByIdWithPassword(user : UserModel){
        if(user.password){
            user.password = await bcrypt.hash(user.password,SALT_PASSWORD)
        }

        const updateUser = await this.prismaClient.user.update({
            where: {
              id: user.id,
            },
            data: {
              fullname: user.fullname,
              phone: user.phone,
              password:user.password
              
            },
          })
    }

    async validateUser(username :string,password:string){
        let user = await this.findOne({email:username});
        if (!user){
            user = await this.findOne({phone:username});
        }

        if(!user) throw new AuthenticationException();

        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch) throw new AuthenticationException(); 
        delete user.password;
        return user;
    }


}


class AuthenticationException extends Error{
        name = 'ValidationError';
        message = 'invalid email/phone or password'
}

class CreateNewUserException extends Error{
    name='CreateNewUserException';
    message='something wrong ...'
}

class UserNotFoundException extends Error{
    name='UserNotFoundExecption';
    message='user not found !'
}

class UpdateUserException extends Error{
    name='UpdateUserException';
    message='something wrong ...'
}
