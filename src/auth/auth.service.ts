import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import * as admin from 'firebase-admin';

const firebase_params = {
  type: process.env.FIREBASE_TYPE,
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  clientId: process.env.FIREBASE_CLIENT_ID,
  authUri: process.env.FIREBASE_AUTH_URI,
  tokenUri: process.env.FIREBASE_TOKEN_URI,
  authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  clientC509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private firebaseApp: any;
  constructor(private readonly httpService: HttpService) {
    this.firebaseApp = admin
      .initializeApp({
        credential: admin.credential.cert(firebase_params),
      })
      .auth();
  }

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
    const uidExists = this.firebaseApp
      .getUser(decodedToken.userId)
      .then(() => true)
      .catch(() => false);

    if (!uidExists) {
      await this.firebaseApp
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
      const token = await this.firebaseApp.createCustomToken(
        decodedToken.userId,
        {
          role: 'user',
        },
      );
      return { token: token };
    } else {
      const token = await this.firebaseApp.createCustomToken(
        decodedToken.userId,
        {
          role: 'user',
        },
      );
      return { token: token };
    }
  }
}
