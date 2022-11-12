import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { Deck, DeckDocument } from './schemas/deck.schema';

@Injectable()
export class DeckService {
  constructor(
    @InjectModel(Deck.name) private readonly model: Model<DeckDocument>,
  ) {}

  async findAll(): Promise<Deck[]> {
    const decks = await this.model.find().exec();
    console.log(decks);
    return decks;
  }

  async findOne(id: string): Promise<Deck> {
    // console.log(id);
    const deckTemp = await this.model.findOne({ deckID: id }).exec();
    if (!(deckTemp.cards.length > 0)) return deckTemp;
    const deck = await this.model
      .aggregate([
        {
          $match: {
            deckID: id,
          },
        },
        {
          $unwind: {
            path: '$cards',
          },
        },
        {
          $lookup: {
            from: 'cards',
            localField: 'cards',
            foreignField: 'cardID',
            as: 'cards',
          },
        },
        {
          $unwind: {
            path: '$cards',
          },
        },
        {
          $group: {
            _id: '$_id',
            cards: {
              $push: '$cards',
            },
            deckName: {
              $first: '$deckName',
            },
            ownerID: {
              $first: '$ownerID',
            },
            deckID: {
              $first: '$deckID',
            },
          },
        },
      ])
      .exec();

    if (deck.length === 0) {
      throw new NotFoundException('Deck not found');
    }

    return deck[0];
  }
  async findByOwner(ownerID: string): Promise<Deck[]> {
    return await this.model.find({ ownerID: ownerID });
  }

  async create(createDeckDto: CreateDeckDto): Promise<Deck> {
    return await new this.model({
      ...createDeckDto,
    }).save();
  }

  async update(
    id: string,
    userID: string,
    updateDeckDto: UpdateDeckDto,
  ): Promise<Deck> {
    return await this.model.findOneAndUpdate(
      { deckID: id, ownerID: userID },
      {
        $set: {
          deckName: updateDeckDto.deckName,
          cards: updateDeckDto.cards,
        },
      },
    );
  }
  async delete(id: string): Promise<Deck> {
    return await this.model.findOneAndRemove({ deckID: id });
  }
}
