import { Module } from '@nestjs/common';
import { TeamMembersService } from './team-members.service';
import { TeamMembersController } from './team-members.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamMemberSchema } from './entities/team-member.entity';
import { CloudinaryModule } from 'src/Cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'TeamMember', schema: TeamMemberSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [TeamMembersController],
  providers: [TeamMembersService],
})
export class TeamMembersModule { }
