import { Controller, Get, Put, Post, Delete, Body, Param, Patch, UseGuards, } from '@nestjs/common';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { DeckService } from './deck.service';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase.guard';
import { User } from 'src/auth/decorators/user.decorator';

@Controller("deck")
export class DeckController {
  constructor(private readonly deckService: DeckService) { }

  @UseGuards(FirebaseAuthGuard)
  @Post()
  async create(@User() user, @Body() createDeckDto: CreateDeckDto) {
    createDeckDto.ownerID = user.user_id
    return await this.deckService.create(createDeckDto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDeckDto: UpdateDeckDto, @User() user) {
    return await this.deckService.update(id, user.user_id, updateDeckDto);
  }


  @UseGuards(FirebaseAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.deckService.delete(id);
  }



  @UseGuards(FirebaseAuthGuard)
  @Get(':id')
  async findByID(@Param('id') id: string) {
    return await this.deckService.findOne(id);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get()
  async findByOwner(@User() user) {
    return await this.deckService.findByOwner(user.user_id);
  }
}
