import { FirebaseService } from '@app/common';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-firebase-jwt';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(FirebaseStrategy.name); // Define Logger

  constructor(private readonly firebaseService: FirebaseService) {
    // Constructor and inject FirebaseService
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Inherit from passport-firebase-jwt to get token from header as bearer token
    });
  }

  async validate(payload) {
    // console.log(payload);
    // payload from class call

    try {
      const decodeToken = await this.firebaseService
        /* Send Token to firebase via FirebaseService
        for verify token */
        .getAuth()
        .verifySessionCookie(payload, true);

      // Verify token from FirebaseService
      this.logger.debug(decodeToken);

      if (!decodeToken) {
        throw new UnauthorizedException(); // Throw UnauthorizedException if token is invalid
      }
      // Return decodedToken if token is valid
      const result = {
        user_id: decodeToken.user_id,
        expires_in: decodeToken.exp,
      };
      return result;
    } catch (e) {
      this.logger.error(e);
    }
  }
}
