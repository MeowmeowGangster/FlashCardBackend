import { BaseDeckDto } from "./base-deck.dto";

export class UpdateDeckDto extends BaseDeckDto{
    deckName: string;
    cards:string[]
}