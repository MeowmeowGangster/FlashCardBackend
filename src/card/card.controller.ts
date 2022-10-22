import { Controller, Get, Put,Post,Delete,Body,Param,Patch ,UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase.guard';
import { CardService } from './card.service';
import { User } from '../auth/decorators/user.decorator';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  // @UseGuards(FirebaseAuthGuard)
  @Post()
  async create(@Body() createCardDto: CreateCardDto){
    return await this.cardService.create(createCardDto);
  }

  // @UseGuards(FirebaseAuthGuard)
  @Patch(':id')
  async update(@Param('id')id:string,@Body()updateCardDto:UpdateCardDto){
    return await this.cardService.update(id,updateCardDto);
  }


  // @UseGuards(FirebaseAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id:string){
    return await this.cardService.delete(id);
  }

  // @UseGuards(FirebaseAuthGuard)
  @Get()
  async index(){
    return await this.cardService.findAll();
  }

  // @UseGuards(FirebaseAuthGuard)
  @Get(':id')
  async find(@Param('id')id:string){
    return await this.cardService.findOne(id);
  }
}
