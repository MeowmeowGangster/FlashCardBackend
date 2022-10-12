import * as admin from 'firebase-admin';

import { Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseService {
  private readonly firebaseAdmin: admin.app.App;

  constructor() {
    this.firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert({
        private_key: process.env.FIREBASE_PRIVATE_KEY,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        project_id: process.env.FIREBASE_PROJECT_ID,
      } as Partial<admin.ServiceAccount>),
    });
  }
}
