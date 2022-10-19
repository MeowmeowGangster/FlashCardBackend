import { Controller, Get ,Put,Post,Delete,Body,Param,Patch, UseGuards, } from '@nestjs/common';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { DeckService } from './deck.service';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase.guard';

@Controller("deck")
export class DeckController {
  constructor(private readonly deckService: DeckService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post()
  async create(@Body() createDeckDto: CreateDeckDto){
    return await this.deckService.create(createDeckDto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch(':id')
  async update(@Param('id')id:string,@Body()updateDeckDto:UpdateDeckDto){
    return await this.deckService.update(id,updateDeckDto);
  }


  @UseGuards(FirebaseAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id:string){
    return await this.deckService.delete(id);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get()
  async index(){
    return await this.deckService.findAll();
  }

  @UseGuards(FirebaseAuthGuard)
  @Get(':id')
  async find(@Param('id')id:string){
    return await this.deckService.findOne(id);
  }
}
