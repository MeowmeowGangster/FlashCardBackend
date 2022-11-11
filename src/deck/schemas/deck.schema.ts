import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeckDocument = Deck & Document;

@Schema({ timestamps: true })
export class Deck {
  @Prop({ required: true })
  ownerID: string;

  @Prop()
  deckID: string;

  @Prop({ require: true })
  deckName: string;

  @Prop()
  cards: string[];
}
export const DeckSchema = SchemaFactory.createForClass(Deck);
