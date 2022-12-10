import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Patch,
  UseGuards,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase.guard';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/auth/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssetsService } from './assets.service';

@Controller()
export class CardController {
  constructor(
    private readonly cardService: CardService,
    private readonly assestsServie: AssetsService,
  ) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('/cards')
  async index() {
    return await this.cardService.findAll();
  }

  @Get('/cards/random')
  async getRandomCard(@Query('limit') limit: number) {
    console.log(limit);
    return await this.cardService.getRandomCard(Number(limit));
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('/cards')
  @UseInterceptors(FileInterceptor('file')) // FileInterceptor is a NestJS interceptor that handles file uploads
  async create(
    @UploadedFile() file: Express.Multer.File,
    @User() user,
    @Body() createCardDto: CreateCardDto,
  ) {
    createCardDto.ownerID = user.user_id;
    createCardDto.cardID = uuidv4();

    if (file) {
      const response = await this.assestsServie.updateAsset(file);
      createCardDto.cardPic = response.url[0];
    }

    return await this.cardService.create(createCardDto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch('/cards/:id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    if (file) {
      const response = await this.assestsServie.updateAsset(file);
      updateCardDto.cardPic = response.url[0];
    }

    return await this.cardService.update(id, updateCardDto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Delete('/cards/:id')
  async delete(@Param('id') id: string) {
    return await this.cardService.delete(id);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('/cards/:id')
  async find(@Param('id') id: string) {
    return await this.cardService.findOne(id);
  }
}
