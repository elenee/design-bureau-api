import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProjectStatus } from '../enums/project-status.enum';
import { ProjectCategory } from '../enums/project-catgeroy.enum';
import { ProjectProgram } from '../enums/project-program.enum';

@Schema({ timestamps: true })
export class Project {
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String })
  slug: string;
  @Prop({ type: String, required: true })
  location: string;
  @Prop({ type: Number, required: true })
  year: number;
  @Prop({ type: String, enum: ProjectCategory, required: true })
  category: ProjectCategory;
  @Prop({ type: String, enum: ProjectProgram, required: true })
  program: ProjectProgram;
  @Prop({ type: String, enum: ProjectStatus, required: true })
  status: ProjectStatus;
  @Prop({ type: Number, required: true })
  area: number;
  @Prop({ type: String, required: true })
  description: string;
  @Prop({ type: String, required: true })
  text: string;
  @Prop({ required: true })
  url: string;
  @Prop({ required: true })
  key: string;
  @Prop({ type: [{ url: String, key: String }], default: [] })
  images: { url: string; key: string }[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
