import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
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

    const ext = file.mimetype.split('/')[1];
    const fileId = `team-members/${randomUUID()}.${ext}`;
    const url = await this.awsService.uploadFile(fileId, file.buffer, file.mimetype);

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

  async findOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid mongo id');
    const teamMember = await this.teamMemberModel.findById(id);
    if (teamMember) throw new NotFoundException('Team member not found');
    return teamMember;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid mongo id');
    const teamMember = await this.teamMemberModel.findByIdAndDelete(id);
    if (!teamMember) throw new NotFoundException('Team member not found');
    await this.awsService.deleteFile(teamMember.key);
    return `image deleted successfully`;
  }

  async update(
    id: string,
    updateTeamMemberDto: UpdateTeamMemberDto,
    file: Express.Multer.File,
  ) {
    if (!isValidObjectId(id)) throw new BadRequestException();
    const existingMember = await this.teamMemberModel.findById(id);
    if (!existingMember) throw new BadRequestException('Team member not found');

    let updateData: any = { ...updateTeamMemberDto };

    if (file) {
      const ext = file.mimetype.split('/')[1];
      const newFileId = `team-members/${randomUUID()}.${ext}`;

      const newUrl = await this.awsService.uploadFile(newFileId, file.buffer, file.mimetype);

      updateData.url = newUrl;
      updateData.key = newFileId;
      await this.awsService.deleteFile(existingMember.key);
    }

    const updatedMember = await this.teamMemberModel.findByIdAndUpdate(
      id,
      updateData,
      { returnDocument: 'after' },
    );

    return updatedMember;
  }
}
