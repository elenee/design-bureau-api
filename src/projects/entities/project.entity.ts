import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Project {
  @Prop({ type: String })
  name: string;
  @Prop({ required: true })
  url: string;
  @Prop({ required: true })
  key: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
