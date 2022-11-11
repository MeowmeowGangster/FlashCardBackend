import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { FirebaseService } from '@app/common';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly httpService = new HttpService();

  constructor(private readonly firebaseService: FirebaseService) {}

  async validateUser(idToken: string): Promise<any> {
    /* 
    Send LINE Access Token to LINE  for verify and get user profile
    */
    const response$ = this.httpService.get(
      `https://api.line.me/v2/profile`,

      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    const response = await lastValueFrom(response$);
    return response.data;
  }

  async validateFirebaseIdToken(idToken: string) {
    const decodedToken = await this.firebaseService
      .getAuth()
      .verifyIdToken(idToken);
    return decodedToken;
  }

  async getSession(idToken: string) {
    const decodedToken = await this.firebaseService
      .getAuth()
      .createSessionCookie(idToken, { expiresIn: 60 * 60 * 24 * 5 * 1000 })
      .then((sessionCookie) => {
        return sessionCookie;
      })
      .catch((error) => {
        this.logger.log(error);
        throw new UnauthorizedException();
      });
    return { token: decodedToken };
  }

  async login(idtoken: string) {
    const decodedToken = await this.validateUser(idtoken);

    this.logger.log(decodedToken);
    const uidExists = this.firebaseService
      .getAuth()
      .getUser(decodedToken.userId)
      .then(() => true)
      .catch(() => false); /// Check if user exists in Firebase
    this.logger.debug('uidExists', uidExists);
    if (!uidExists) {
      await this.firebaseService
        .getAuth()
        .createUser({
          uid: decodedToken.userId,
          displayName: decodedToken.displayName,
          photoURL: decodedToken.pictureUrl,
        }) // Create user in Firebase
        .then((userRecord) => {
          // See the UserRecord reference doc for the contents of userRecord.
          this.logger.log('Successfully created new user:', userRecord.uid);
        })
        .catch((error) => {
          this.logger.log('Error creating new user:', error);
        });
      const token = await this.firebaseService
        .getAuth()
        .createCustomToken(decodedToken.userId, {
          role: 'user',
        }); // Create custom token for user
      return { token: token };
    } else {
      const token = await this.firebaseService
        .getAuth()
        .createCustomToken(decodedToken.userId, {
          role: 'user',
        }); // Create custom token for user
      this.logger.log('token', token);
      return { token: token };
    }
  }
}
