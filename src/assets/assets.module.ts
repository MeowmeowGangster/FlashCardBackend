import { FirebaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';

@Module({
  imports: [FirebaseModule],
  controllers: [AssetsController],
  providers: [AssetsService],
})
export class AssetsModule {}
