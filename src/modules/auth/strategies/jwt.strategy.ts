import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('app.jwt.secret') as string,
    });
  }

  async validate(payload: any) {
    console.log("JwtStrategy: Validating payload", payload);
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      console.log("JwtStrategy: User not found for sub", payload.sub);
      return null;
    }
    console.log("JwtStrategy: User found", user._id);
    return user;
  }
}
