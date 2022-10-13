import { Controller, Get } from '@nestjs/common';
import { DeckService } from './deck.service';

@Controller()
export class DeckController {
  constructor(private readonly deckService: DeckService) {}

  @Get()
  getHello(): string {
    return this.deckService.getHello();
  }
}
