import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deck, DeckDocument } from 'src/deck/schemas/deck.schema';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card, CardDocument } from './schemas/card.schema';

@Injectable()
export class CardService {
  private readonly logger = new Logger(CardService.name);
  constructor(
    @InjectModel(Card.name) private readonly model: Model<CardDocument>,
    @InjectModel(Deck.name) private readonly deck: Model<DeckDocument>,
  ) {}

  async findAll(): Promise<Card[]> {
    return await this.model.find().exec();
  }

  async findOne(id: string): Promise<Card> {
    return await this.model.findOne({ cardID: id });
  }

  async create(createCardDto: CreateCardDto): Promise<Card> {
    console.log(createCardDto);
    await this.deck
      .findOneAndUpdate(
        { deckID: createCardDto.deckID },
        {
          $push: { cards: createCardDto.cardID },
        },
      )
      .exec();
    return await new this.model({
      ...createCardDto,
    }).save();
  }

  async update(id: string, updateCardDto: UpdateCardDto): Promise<Card> {
    return await this.model.findOneAndUpdate(
      { cardID: id },
      {
        $set: {
          cardName: updateCardDto.cardName,
          cardMemo: updateCardDto.cardMemo,
          cardPic: updateCardDto.cardPic,
        },
      },
    );
  }
  async delete(id: string): Promise<Card> {
    return await this.model.findOneAndRemove({ cardID: id });
  }

  async getRandomCard(deckid: string, limit: number): Promise<Card[]> {
    const rest = await this.model.aggregate([
      {
        $match: {
          deckID: deckid,
        },
      },
      { $sample: { size: limit } },
    ]);
    this.logger.log(rest);

    return rest;
  }
}
