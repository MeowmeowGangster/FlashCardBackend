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
} from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase.guard';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Controller()
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get()
  async index() {
    return await this.cardService.findAll();
  }

  @Get('/cards/random')
  async getRandomCard(@Query('limit') limit: number) {
    console.log(limit);
    return await this.cardService.getRandomCard(Number(limit));
  }

  @UseGuards(FirebaseAuthGuard)
  @Post()
  async create(@Body() createCardDto: CreateCardDto) {
    return await this.cardService.create(createCardDto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch('/cards/:id')
  async update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
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
