import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class TeamMember {
  @Prop({ type: String })
  name: string;
  @Prop({ type: String })
  position: string;
  @Prop({ required: true })
  url: string;
  @Prop({ required: true })
  key: string;
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);
