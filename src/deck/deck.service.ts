import { Injectable } from '@nestjs/common';

@Injectable()
export class DeckService {
  getHello(): string {
    return 'Hello World! Deck';
  }
}
