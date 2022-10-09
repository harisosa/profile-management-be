import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthService {
    constructor(private userService : UserService){}

    async authenticate(username:string,password:string){
        try{
            const user = await this.userService.validateUser(username,password);

            const token = jwt.sign(
                {
                    uid:user.id,

                },
                process.env.SECRET_JWT,
                {
                    expiresIn:'7d'
                }
            )
            let ut = new UserWithToken(user);
            ut.token = token
            return ut;
        }catch(err){
            throw err;
        }
    }
}

class UserWithToken {
    id:string;
    email :string;
    phone:string;
    fullname:string;
    createdAt: string;
    token:string;
    constructor(obj:any){
        this.id = obj.id;
        this.email = obj.email;
        this.createdAt = obj.createdAt;
        this.fullname = obj.fullname;
        this.phone = obj.phone;
    }
}