import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './entities/project.entity';
import { randomUUID } from 'crypto';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('Project') private projectModel: Model<Project>,
    private awsService: AwsS3Service,
  ) {}

  async create(createProjectDto: CreateProjectDto, file: Express.Multer.File) {
    if (!file) throw new BadRequestException();

    const ext = file.mimetype.split('/')[1];
    const fileId = `projects/${randomUUID()}.${ext}`;
    const url = await this.awsService.uploadFile(fileId, file.buffer);

    const image = await this.projectModel.create({
      ...createProjectDto,
      url,
      key: fileId,
    });

    return image;
  }

  findAll() {
    return `This action returns all projects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
