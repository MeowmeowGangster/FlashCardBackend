import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { FirebaseService } from '@app/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async validateUser(idToken: string): Promise<any> {
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

  async login(idtoken: string) {
    const decodedToken = await this.validateUser(idtoken);

    this.logger.log(decodedToken);
    const uidExists = this.firebaseService
      .getAuth()
      .getUser(decodedToken.userId)
      .then(() => true)
      .catch(() => false);

    if (!uidExists) {
      await this.firebaseService
        .getAuth()
        .createUser({
          uid: decodedToken.userId,
          displayName: decodedToken.displayName,
          photoURL: decodedToken.pictureUrl,
        })
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
        });
      return { token: token };
    } else {
      const token = await this.firebaseService
        .getAuth()
        .createCustomToken(decodedToken.userId, {
          role: 'user',
        });
      return { token: token };
    }
  }
}
