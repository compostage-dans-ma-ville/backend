import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from './auth.service'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { User } from '@prisma/client'

export interface JwtPayload { email: string;}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET_KEY
    })
  }

  async validate(payload: JwtPayload): Promise<User | null> {
    const user = await this.authService.validateUser(payload)
    if (!user) {
      throw new HttpException(
        'Invalid token',
        HttpStatus.UNAUTHORIZED
      )
    }
    return user
  }
}
