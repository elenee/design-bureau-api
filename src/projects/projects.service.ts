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
import slugify from 'slugify';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('Project') private projectModel: Model<Project>,
    private awsService: AwsS3Service,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    coverImage: Express.Multer.File,
    images?: Express.Multer.File[],
  ) {
    if (!coverImage) throw new BadRequestException('Cover image is required');

    const slug = slugify(createProjectDto.name, { lower: true });
    const existing = await this.projectModel.findOne({ slug });
    if (existing)
      throw new BadRequestException('Project with this name already exists');

    const ext = coverImage.mimetype.split('/')[1];
    const fileId = `projects/${randomUUID()}.${ext}`;
    const url = await this.awsService.uploadFile(
      fileId,
      coverImage.buffer,
      coverImage.mimetype,
    );

    const project = await this.projectModel.create({
      ...createProjectDto,
      slug,
      url,
      key: fileId,
    });

    let uploadedImages: any = [];
    if (images && images.length > 0) {
      uploadedImages = await Promise.all(
        images.map(async (image) => {
          const imgExt = image.mimetype.split('/')[1];
          const imageId = `projects/${project._id}/${randomUUID()}.${imgExt}`;
          const imageUrl = await this.awsService.uploadFile(
            imageId,
            image.buffer,
            image.mimetype,
          );
          return { url: imageUrl, key: imageId };
        }),
      );

      return await this.projectModel.findByIdAndUpdate(
        project._id,
        { $push: { images: { $each: uploadedImages } } },
        { returnDocument: 'after' },
      );
    }

    return project;
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

  async findBySlug(slug: string) {
    const project = await this.projectModel.findOne({ slug });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid mongo id');
    const project = await this.projectModel.findByIdAndDelete(id);
    if (!project) throw new NotFoundException('Project not found');
    await this.awsService.deleteFile(project.key);
    for (const image of project.images) {
      await this.awsService.deleteFile(image.key);
    }
    return 'project deleted successfully';
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    coverImage?: Express.Multer.File,
    images?: Express.Multer.File[],
  ) {
    if (!isValidObjectId(id)) throw new BadRequestException();
    const existingProject = await this.projectModel.findById(id);
    if (!existingProject) throw new BadRequestException('Project not found');

    let updateData: any = { ...updateProjectDto };

    if (coverImage) {
      const ext = coverImage.mimetype.split('/')[1];
      const newFileId = `projects/${randomUUID()}.${ext}`;

      const newUrl = await this.awsService.uploadFile(
        newFileId,
        coverImage.buffer,
        coverImage.mimetype,
      );
      updateData.url = newUrl;
      updateData.key = newFileId;

      await this.awsService.deleteFile(existingProject.key);
    }

    if (images && images.length > 0) {
      const uploadedImages = await Promise.all(
        images.map(async (file) => {
          const ext = file.mimetype.split('/')[1];
          const imageId = `projects/${id}/${randomUUID()}.${ext}`;
          const url = await this.awsService.uploadFile(
            imageId,
            file.buffer,
            file.mimetype,
          );
          return { url, key: imageId };
        }),
      );
      updateData = {
        ...updateData,
        $push: { images: { $each: uploadedImages } },
      };
    }

    const updatedProject = await this.projectModel.findByIdAndUpdate(
      id,
      updateData,
      { returnDocument: 'after' },
    );

    return updatedProject;
  }

  async removeImages(id: string, imageId: string) {
    if (!isValidObjectId(id) || !isValidObjectId(imageId)) {
      throw new BadRequestException('Invalid mongo id');
    }
    const project = await this.projectModel.findById(id);
    if (!project) throw new NotFoundException('Project not found');
    const projectImage = project.images.find(
      (img) => (img as any)._id.toString() === imageId,
    );
    if (!projectImage) throw new NotFoundException('image not found');
    await this.awsService.deleteFile(projectImage.key);

    await this.projectModel.findByIdAndUpdate(
      id,
      {
        $pull: { images: { _id: imageId } },
      },
      { returnDocument: 'after' },
    );
    return 'Image deleted successfully';
  }
}
