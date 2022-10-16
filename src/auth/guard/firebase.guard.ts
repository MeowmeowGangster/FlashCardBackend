import { AuthGuard } from '@nestjs/passport';

export class FirebaseAuthGuard extends AuthGuard('firebase-jwt') {} // Inheritance for auth
