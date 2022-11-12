import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { PassportModule } from '@nestjs/passport';
import { FirebaseStrategy } from '../auth/strategies/firebase.strategies';
import { FirebaseModule } from '@app/common';
import { Card, CardSchema } from './schemas/card.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Deck, DeckSchema } from '../deck/schemas/deck.schema';

@Module({
  imports: [
    PassportModule,
    FirebaseModule,
    MongooseModule.forFeature([
      { name: Card.name, schema: CardSchema },
      { name: Deck.name, schema: DeckSchema },
    ]),
  ],
  controllers: [CardController],
  providers: [CardService, FirebaseStrategy],
})
export class CardModule {}
