import { Module } from '@nestjs/common';
import { TeamMembersService } from './team-members.service';
import { TeamMembersController } from './team-members.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamMemberSchema } from './entities/team-member.entity';
import { AwsS3Module } from 'src/aws-s3/aws-s3.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'TeamMember', schema: TeamMemberSchema },
    ]),
    AwsS3Module,
  ],
  controllers: [TeamMembersController],
  providers: [TeamMembersService],
})
export class TeamMembersModule {}
