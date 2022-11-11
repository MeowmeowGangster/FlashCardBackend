import { BaseDeckDto } from './base-deck.dto';

export class CreateDeckDto extends BaseDeckDto {
  ownerID: string;
  deckName: string;
}
