import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card, CardDocument } from './schemas/card.schema'

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card.name) private readonly model: Model<CardDocument>,
  ) { }

  async findAll(): Promise<Card[]> {
    return await this.model.find().exec();
  }

  async findOne(id: string): Promise<Card> {
    return await this.model.findOne({"cardID":id})
  }

  async create(createCardDto: CreateCardDto): Promise<Card> {
    return await new this.model({
      ...createCardDto,
    }).save();
  }

  async update(id: string, updateCardDto: UpdateCardDto): Promise<Card> {
    return await this.model.findOneAndUpdate({ "cardID": id }, { $set: {
      cardName:updateCardDto.cardName,
      cardMemo:updateCardDto.cardMemo,
      cardPic:updateCardDto.cardPic
    } })
  }
  async delete(id: string): Promise<Card> {
    return await this.model.findOneAndRemove({"cardID":id })
  }
}
