import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CardModule } from './card/card.module';
import { DeckModule } from './deck/deck.module';
import { DatabaseModule, FirebaseModule } from '@app/common';
import { AssetsModule } from './assets/assets.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    CardModule,
    DeckModule,
    AssetsModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
