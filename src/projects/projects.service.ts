import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
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
    return this.projectModel.find();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid mongo id');
    const project = await this.projectModel.findById(id);
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid mongo id');
    const project = await this.projectModel.findByIdAndDelete(id);
    if (!project) throw new BadRequestException('Project not found');
    await this.awsService.deleteFile(project.key);
    return 'image deleted successfully';
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    file: Express.Multer.File,
  ) {
    if (!isValidObjectId(id)) throw new BadRequestException();
    const existingProject = await this.projectModel.findById(id);
    if (!existingProject) throw new BadRequestException('Project not found');

    let updateData: any = { ...updateProjectDto };

    if (file) {
      const ext = file.mimetype.split('/')[1];
      const newFileId = `projects/${randomUUID()}.${ext}`;

      const newUrl = await this.awsService.uploadFile(newFileId, file.buffer);
      updateData.url = newUrl;
      updateData.key = newFileId;

      await this.awsService.deleteFile(existingProject.key);
    }
    const updatedProject = await this.projectModel.findByIdAndUpdate(
      id,
      updateData,
      { returnDocument: 'after' },
    );

    return updatedProject;
  }
}
