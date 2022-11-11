import { Injectable } from '@nestjs/common';
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
    return await this.model.find().exec();
  }

  async findOne(id: string): Promise<Deck> {
    return await this.model.findOne({ deckID: id });
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
