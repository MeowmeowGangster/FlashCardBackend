import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Patch,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { DeckService } from './deck.service';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase.guard';
import { User } from 'src/auth/decorators/user.decorator';
import { v4 as uuidv4 } from 'uuid';

@Controller()
export class DeckController {
  constructor(private readonly deckService: DeckService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('/decks')
  async findByOwner(@User() user) {
    return await this.deckService.findByOwner(user.user_id);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('/decks')
  async create(@User() user, @Body() createDeckDto: CreateDeckDto) {
    createDeckDto.ownerID = user.user_id;
    createDeckDto.deckID = uuidv4();
    if (createDeckDto.deckName === undefined) throw new BadRequestException();
    if (createDeckDto.deckName === '') throw new BadRequestException();
    return await this.deckService.create(createDeckDto);
  }
  @UseGuards(FirebaseAuthGuard)
  @Get('/decks/:id')
  async findByID(@Param('id') id: string) {
    console.log(id);
    return await this.deckService.findOne(id);
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch('/decks/:id')
  async update(
    @Param('id') id: string,
    @Body() updateDeckDto: UpdateDeckDto,
    @User() user,
  ) {
    return await this.deckService.update(id, user.user_id, updateDeckDto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Delete('/decks/:id')
  async delete(@Param('id') id: string) {
    return await this.deckService.delete(id);
  }
}
