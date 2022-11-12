import { BaseCardDto } from './base-card.dto';

export class CreateCardDto extends BaseCardDto {
  cardName: string;
  cardMemo: string;
  deckID: string;
}
