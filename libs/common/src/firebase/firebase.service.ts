import * as admin from 'firebase-admin';
import { Injectable, Logger } from '@nestjs/common';
import * as firebaseConfig from './service-account.json';

const firebase_params = {
  type: firebaseConfig.type,
  projectId: firebaseConfig.project_id,
  privateKeyId: firebaseConfig.private_key_id,
  privateKey: firebaseConfig.private_key,
  clientEmail: firebaseConfig.client_email,
  clientId: firebaseConfig.client_id,
  authUri: firebaseConfig.auth_uri,
  tokenUri: firebaseConfig.token_uri,
  authProviderX509CertUrl: firebaseConfig.auth_provider_x509_cert_url,
  clientC509CertUrl: firebaseConfig.client_x509_cert_url,
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
