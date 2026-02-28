import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(@InjectModel('Message') private messageModel: Model<Message>) {}

  async create(createMessageDto: CreateMessageDto) {
    const message = await this.messageModel.create(createMessageDto);
    return message;
  }

  findAll() {
    return this.messageModel.find();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid mongo id');
    const message = await this.messageModel.findById(id);
    if (!message) throw new NotFoundException('message not found');
    return message;
  }

  async markAsRead(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid mongo id');
    const message = await this.messageModel.findByIdAndUpdate(
      id,
      {
        isRead: true,
      },
      { returnDocument: 'after' },
    );
    if (!message) throw new NotFoundException('message not found');
    return message;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid mongo id');
    const message = await this.messageModel.findByIdAndDelete(id);
    if (!message) throw new NotFoundException('message not found');
    return message;
  }
}
