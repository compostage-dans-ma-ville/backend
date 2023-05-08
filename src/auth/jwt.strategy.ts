import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { UserService } from '~/user/user.service'

export interface JwtPayload {
  id: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY
    })
  }

  async validate(payload: JwtPayload): Promise<User | null> {
    const user = await this.userService.findById(Number(payload.id))

    if (!user) {
      throw new HttpException(
        'Invalid token',
        HttpStatus.UNAUTHORIZED,
      )
    }

    return user
  }
}
