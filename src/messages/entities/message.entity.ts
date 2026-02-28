import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProjectCategory } from 'src/projects/enums/project-catgeroy.enum';

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: String, required: true })
  fullName: string;
  @Prop({ type: String, required: true })
  email: string;
  @Prop({ type: String, enum: ProjectCategory, required: true })
  interestedIn: string;
  @Prop({ type: String, required: true })
  message: string;
  @Prop({ type: Boolean, default: false })
  isRead: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
