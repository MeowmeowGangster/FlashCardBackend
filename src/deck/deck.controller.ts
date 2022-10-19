import { Controller, Get ,Put,Post,Delete,Body,Param,Patch, } from '@nestjs/common';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { DeckService } from './deck.service';

@Controller("deck")
export class DeckController {
  constructor(private readonly deckService: DeckService) {}

  @Post()
  async create(@Body() createDeckDto: CreateDeckDto){
    return await this.deckService.create(createDeckDto);
  }
  @Patch(':id')
  async update(@Param('id')id:string,@Body()updateDeckDto:UpdateDeckDto){
    return await this.deckService.update(id,updateDeckDto);
  }
  
  @Delete(':id')
  async delete(@Param('id') id:string){
    return await this.deckService.delete(id);
  }
  
  @Get()
  async index(){
    return await this.deckService.findAll();
  }
  @Get(':id')
  async find(@Param('id')id:string){
    return await this.deckService.findOne(id);
  }
}
