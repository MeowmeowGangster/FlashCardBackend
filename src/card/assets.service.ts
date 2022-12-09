import { FirebaseService } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { getStorage } from 'firebase-admin/storage';

@Injectable()
export class AssetsService {
  private readonly logger = new Logger(AssetsService.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  async updateAsset(file: Express.Multer.File) {
    this.logger.log('updateAsset');

    const storage = getStorage(this.firebaseService.getApp()).bucket(); // Get Firebase Storage

    await storage.file('assets/images/' + file.originalname).save(file.buffer); // Save file to Firebase Storage

    const url = await storage
      .file('assets/images/' + file.originalname)
      .getSignedUrl({
        action: 'read',
        expires: '03-09-2023',
      }); // Get Signed URL from Firebase Storage for file

    return { message: 'success', url: url };
  }
}
