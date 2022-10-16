import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { PassportModule } from '@nestjs/passport';
import { FirebaseStrategy } from '../auth/strategies/firebase.strategies';
import { FirebaseModule } from '@app/common';

@Module({
  imports: [PassportModule, FirebaseModule],
  controllers: [CardController],
  providers: [CardService, FirebaseStrategy],
})
export class CardModule {}
