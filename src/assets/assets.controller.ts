import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssetsService } from './assets.service';

@Controller()
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post('/assets/upload')
  @UseInterceptors(FileInterceptor('file'))
  updateAsset(@UploadedFile() file: Express.Multer.File) {
    return this.assetsService.updateAsset(file);
  }
}
