import * as admin from 'firebase-admin';
import { Injectable, Logger } from '@nestjs/common';

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
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);
  private firebaseApp: any;
  constructor() {
    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(firebase_params), // Initialize Firebase with firebase_params
      storageBucket: 'gs://standupcodelab.appspot.com', // Initialize Firebase Storage
    });
    this.logger.log('Firebase initialized');
  }
  getAuth() {
    return this.firebaseApp.auth(); // Return Firebase Auth
  }
  getApp() {
    return this.firebaseApp; // Return Firebase App
  }
}
