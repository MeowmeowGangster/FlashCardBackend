import { Module } from '@nestjs/common';
import { DeckController } from './deck.controller';
import { DeckService } from './deck.service';
import { Deck,DeckSchema} from "./schemas/deck.schema"
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{name :Deck.name,schema: DeckSchema}]),
  ],
  controllers: [DeckController],
  providers: [DeckService],
})
export class DeckModule {}
