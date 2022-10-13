import { FirebaseService } from '@app/common/firebase/firebase.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly firebaseAdmin;
  constructor(private readonly httpService: HttpService) {
    this.firebaseAdmin = FirebaseService;
  }
  getHello(): string {
    return 'Hello World!';
  }

  async valifyLineToken(token: string) {
    const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(token);
    return decodedToken;
  }
  async validateUser(idToken: string, channelId: string): Promise<any> {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const response$ = this.httpService.post(
      `https://api.line.me/oauth2/v2.1/verify`,
      {
        idToken: idToken,
        channelId: channelId,
      },
      { headers: headers },
    );
    return await lastValueFrom(response$);
  }

  async login(idtoken: string, channelid: string) {
    const decodedToken = await this.validateUser(idtoken, channelid);
    const user = await this.firebaseAdmin.auth().getUserByID(decodedToken.sub);
    if (!user) {
      // If not user, create user
      await this.firebaseAdmin
        .auth()
        .createUser({
          uid: decodedToken.uid,
          displayName: decodedToken.name,
          photoURL: decodedToken.picture,
        })
        .then((userRecord) => {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log('Successfully created new user:', userRecord.uid);
        })
        .catch((error) => {
          console.log('Error creating new user:', error);
        });

      // create custom claims
      await this.firebaseAdmin
        .auth()
        .createCustomToken(decodedToken.uid, {
          role: 'user',
        })
        .then((customToken) => {
          return customToken;
        })
        .catch((error) => {
          console.log('Error creating custom token:', error);
        });
    }
  }
}
