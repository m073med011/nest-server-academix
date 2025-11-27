import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { AuthProvider } from '../../users/schemas/user.schema';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('app.google.clientId'),
      clientSecret: configService.get<string>('app.google.clientSecret'),
      callbackURL: configService.get<string>('app.google.callbackUrl'),
      scope: ['email', 'profile'],
    } as any);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      name: name.givenName + ' ' + name.familyName,
      picture: photos[0].value,
      accessToken,
      provider: AuthProvider.GOOGLE,
    };

    // Here we should probably find or create the user via AuthService
    // For now, let's just return the user object which will be available in req.user
    // The actual user creation/lookup logic from the old project was:
    // 1. Find by email
    // 2. If not found, create new user with isOAuthUser: true

    // We can delegate this to AuthService
    const validatedUser = await this.authService.validateOAuthUser(user);
    done(null, validatedUser);
  }
}
