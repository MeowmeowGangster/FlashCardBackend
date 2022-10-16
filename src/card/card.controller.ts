import { Controller, Get, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase.guard';
import { CardService } from './card.service';
import { User } from '../auth/decorators/user.decorator';
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get()
  getHello(@User() user): string {
    console.log(`UserID: ${user.user_id}`);
    return this.cardService.getHello();
  }
}
