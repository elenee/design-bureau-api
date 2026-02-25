import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamMember } from './entities/team-member.entity';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
import { randomUUID } from 'crypto';

@Injectable()
export class TeamMembersService {
  constructor(
    @InjectModel('TeamMember') private teamMemberModel: Model<TeamMember>,
    private awsService: AwsS3Service,
  ) {}

  async create(
    createTeamMemberDto: CreateTeamMemberDto,
    file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('File is required');
    console.log(file)

    const ext = file.mimetype.split('/')[1];
    const fileId = `team-members/${randomUUID()}.${ext}`;
    const url = await this.awsService.uploadFile(fileId, file.buffer);

    const image = await this.teamMemberModel.create({
      ...createTeamMemberDto,
      url,
      key: fileId,
    });

    return image;
  }

  findAll() {
    return this.teamMemberModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} teamMember`;
  }

  update(id: number, updateTeamMemberDto: UpdateTeamMemberDto) {
    return `This action updates a #${id} teamMember`;
  }

  remove(id: number) {
    return `This action removes a #${id} teamMember`;
  }
}
