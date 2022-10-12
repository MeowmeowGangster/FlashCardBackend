import { FirebaseService } from '@app/common/firebase/firebase.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly firebaseAdmin;
  constructor() {
    this.firebaseAdmin = FirebaseService;
  }

  async validateUser(token: string): Promise<any> {
    const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(token);
    return decodedToken;
  }

  async login(payload: any) {
    const user = await this.firebaseAdmin.auth().getUserByID(payload.uid);
    if (!user) {
      // If not user, create user
      await this.firebaseAdmin
        .auth()
        .createUser({
          uid: payload.uid,
          displayName: payload.name,
          photoURL: payload.picture,
        })
        .then((userRecord) => {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log('Successfully created new user:', userRecord.uid);
        })
        .catch((error) => {
          console.log('Error creating new user:', error);
        });

      // set custom claims
      await this.firebaseAdmin
        .auth()
        .setCustomUserClaims(payload.uid, { user: true });

      // get custom claims
      await this.firebaseAdmin
        .auth()
        .createCustomToken(payload.uid)
        .then((customToken) => {
          return customToken;
        })
        .catch((error) => {
          console.log('Error creating custom token:', error);
        });
    }
    // get custom claims
    await this.firebaseAdmin
      .auth()
      .createCustomToken(payload.uid)
      .then((customToken) => {
        return customToken;
      })
      .catch((error) => {
        console.log('Error creating custom token:', error);
      });
  }
}
