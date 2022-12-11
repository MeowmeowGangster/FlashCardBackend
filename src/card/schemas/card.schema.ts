import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CardDocument = Card & Document;

@Schema({ timestamps: true })
export class Card {
  @Prop({ required: true })
  cardID: string;

  @Prop({ required: true })
  cardName: string;

  @Prop()
  ownerID?: string;

  @Prop()
  deckID?: string;

  @Prop()
  cardPic: string;

  @Prop({ required: true })
  cardMemo: string;
}
export const CardSchema = SchemaFactory.createForClass(Card);
