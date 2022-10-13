import { Controller, Get } from '@nestjs/common';
import { CardService } from './card.service';

@Controller()
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get()
  getHello(): string {
    return this.cardService.getHello();
  }
}
