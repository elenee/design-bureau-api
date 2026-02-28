import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Patch,
  UploadedFiles,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ProjectCategory } from './enums/project-catgeroy.enum';
import { ProjectStatus } from './enums/project-status.enum';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'name',
        'subtitle',
        'location',
        'year',
        'category',
        'program',
        'status',
        'area',
        'description',
        'text',
        'coverImage',
      ],
      properties: {
        name: { type: 'string' },
        subtitle: { type: 'string' },
        location: { type: 'string' },
        year: { type: 'number' },
        category: { type: 'string', enum: Object.values(ProjectCategory) },
        program: { type: 'string' },
        status: { type: 'string', enum: Object.values(ProjectStatus) },
        area: { type: 'number' },
        description: { type: 'string' },
        text: { type: 'string' },
        coverImage: { type: 'string', format: 'binary' },
        images: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'coverImage', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  create(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFiles()
    files: {
      coverImage: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ) {
    return this.projectsService.create(
      createProjectDto,
      files.coverImage[0],
      files.images,
    );
  }

  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          _id: '69a02ef6ec6910baa5521706',
          name: 'APARTMENT WITH CITYSCAPE',
          slug: 'apartment-with-cityscape',
          location: 'Tbilisi, Georgia',
          year: 2024,
          category: 'interior',
          program: 'commercial',
          status: 'completed',
          area: 150,
          description:
            'Located on the 22nd floor of King David Residences in Tbilisi, this apartment was designed as a calm retreat for a frequent traveler. A monochrome palette, curated furniture, and panoramic city views create a refined, hotel-like atmosphere enriched with personal and cultural details.',
          text: 'This captivating apartment is on the 22th floor of King David Residences, an iconic tower that graces the center of Tbilisi, Georgia. It stands as one of the city’s tallest landmarks. This residence serves as a serene retreat for its owner, a frequent visitor to Tbilisi for work. Inspired by the owner’s transient lifestyle, the design captures the sleek aesthetics of a hotel room while introducing elements that impart a comforting sense of coziness. The primary focus of this design venture was to create an inviting interior with a pristine aesthetic, enriched by captivating details that cater to both guests and the owner during moments of personal reflection. The apartment’s extensive windows frame a breathtaking view of Tbilisi, establishing a dynamic ambiance that evolves with the changing natural light. Thoughtfully placed blinds allow residents to control the modulation of light intensity, creating an immersive and personalized ambiance. Furniture takes center stage in crafting a visually striking narrative, featuring a carefully curated selection of iconic pieces seamlessly integrated with Marble Domino tables (design by Madam Bozarjiants), showcasing a lucky number significant to the owner. An asymmetric rug (designed by Madam Bozarjiants), inspired by the works of Georgian artist Vera Pagava, injects an artistic dimension into the living space, infusing a touch of cultural richness into the contemporary design.',
          url: 'https://design-bureau-media.s3.amazonaws.com/projects/4ff55704-a2cc-4b94-ba1f-21bd5d559e6f.jpeg',
          key: 'projects/4ff55704-a2cc-4b94-ba1f-21bd5d559e6f.jpeg',
          images: [
            {
              url: 'https://design-bureau-media.s3.amazonaws.com/projects/69a02ef6ec6910baa5521706/ac669373-a317-4a6b-b40e-604f8c996359.jpeg',
              key: 'projects/69a02ef6ec6910baa5521706/ac669373-a317-4a6b-b40e-604f8c996359.jpeg',
              _id: '69a03c543972269b1d05f897',
            },
          ],
          createdAt: '2026-02-26T11:31:02.984Z',
          updatedAt: '2026-02-26T12:28:04.408Z',
          __v: 0,
        },
      ],
    },
  })
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @ApiOperation({ summary: 'Get project by id' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        _id: '69a02ef6ec6910baa5521706',
        name: 'APARTMENT WITH CITYSCAPE',
        slug: 'apartment-with-cityscape',
        location: 'Tbilisi, Georgia',
        year: 2024,
        category: 'interior',
        program: 'commercial',
        status: 'completed',
        area: 150,
        description:
          'Located on the 22nd floor of King David Residences in Tbilisi, this apartment was designed as a calm retreat for a frequent traveler. A monochrome palette, curated furniture, and panoramic city views create a refined, hotel-like atmosphere enriched with personal and cultural details.',
        text: 'This captivating apartment is on the 22th floor of King David Residences, an iconic tower that graces the center of Tbilisi, Georgia. It stands as one of the city’s tallest landmarks. This residence serves as a serene retreat for its owner, a frequent visitor to Tbilisi for work. Inspired by the owner’s transient lifestyle, the design captures the sleek aesthetics of a hotel room while introducing elements that impart a comforting sense of coziness. The primary focus of this design venture was to create an inviting interior with a pristine aesthetic, enriched by captivating details that cater to both guests and the owner during moments of personal reflection. The apartment’s extensive windows frame a breathtaking view of Tbilisi, establishing a dynamic ambiance that evolves with the changing natural light. Thoughtfully placed blinds allow residents to control the modulation of light intensity, creating an immersive and personalized ambiance. Furniture takes center stage in crafting a visually striking narrative, featuring a carefully curated selection of iconic pieces seamlessly integrated with Marble Domino tables (design by Madam Bozarjiants), showcasing a lucky number significant to the owner. An asymmetric rug (designed by Madam Bozarjiants), inspired by the works of Georgian artist Vera Pagava, injects an artistic dimension into the living space, infusing a touch of cultural richness into the contemporary design.',
        url: 'https://design-bureau-media.s3.amazonaws.com/projects/4ff55704-a2cc-4b94-ba1f-21bd5d559e6f.jpeg',
        key: 'projects/4ff55704-a2cc-4b94-ba1f-21bd5d559e6f.jpeg',
        images: [
          {
            url: 'https://design-bureau-media.s3.amazonaws.com/projects/69a02ef6ec6910baa5521706/ac669373-a317-4a6b-b40e-604f8c996359.jpeg',
            key: 'projects/69a02ef6ec6910baa5521706/ac669373-a317-4a6b-b40e-604f8c996359.jpeg',
            _id: '69a03c543972269b1d05f897',
          },
        ],
        createdAt: '2026-02-26T11:31:02.984Z',
        updatedAt: '2026-02-26T12:28:04.408Z',
        __v: 0,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @ApiOperation({ summary: 'Get project by slug' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        _id: '69a02ef6ec6910baa5521706',
        name: 'APARTMENT WITH CITYSCAPE',
        slug: 'apartment-with-cityscape',
        location: 'Tbilisi, Georgia',
        year: 2024,
        category: 'interior',
        program: 'commercial',
        status: 'completed',
        area: 150,
        description:
          'Located on the 22nd floor of King David Residences in Tbilisi, this apartment was designed as a calm retreat for a frequent traveler. A monochrome palette, curated furniture, and panoramic city views create a refined, hotel-like atmosphere enriched with personal and cultural details.',
        text: 'This captivating apartment is on the 22th floor of King David Residences, an iconic tower that graces the center of Tbilisi, Georgia. It stands as one of the city’s tallest landmarks. This residence serves as a serene retreat for its owner, a frequent visitor to Tbilisi for work. Inspired by the owner’s transient lifestyle, the design captures the sleek aesthetics of a hotel room while introducing elements that impart a comforting sense of coziness. The primary focus of this design venture was to create an inviting interior with a pristine aesthetic, enriched by captivating details that cater to both guests and the owner during moments of personal reflection. The apartment’s extensive windows frame a breathtaking view of Tbilisi, establishing a dynamic ambiance that evolves with the changing natural light. Thoughtfully placed blinds allow residents to control the modulation of light intensity, creating an immersive and personalized ambiance. Furniture takes center stage in crafting a visually striking narrative, featuring a carefully curated selection of iconic pieces seamlessly integrated with Marble Domino tables (design by Madam Bozarjiants), showcasing a lucky number significant to the owner. An asymmetric rug (designed by Madam Bozarjiants), inspired by the works of Georgian artist Vera Pagava, injects an artistic dimension into the living space, infusing a touch of cultural richness into the contemporary design.',
        url: 'https://design-bureau-media.s3.amazonaws.com/projects/4ff55704-a2cc-4b94-ba1f-21bd5d559e6f.jpeg',
        key: 'projects/4ff55704-a2cc-4b94-ba1f-21bd5d559e6f.jpeg',
        images: [
          {
            url: 'https://design-bureau-media.s3.amazonaws.com/projects/69a02ef6ec6910baa5521706/ac669373-a317-4a6b-b40e-604f8c996359.jpeg',
            key: 'projects/69a02ef6ec6910baa5521706/ac669373-a317-4a6b-b40e-604f8c996359.jpeg',
            _id: '69a03c543972269b1d05f897',
          },
        ],
        createdAt: '2026-02-26T11:31:02.984Z',
        updatedAt: '2026-02-26T12:28:04.408Z',
        __v: 0,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete project' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update project' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        subtitle: { type: 'string' },
        location: { type: 'string' },
        year: { type: 'number' },
        category: { type: 'string', enum: Object.values(ProjectCategory) },
        program: { type: 'string' },
        status: { type: 'string', enum: Object.values(ProjectStatus) },
        area: { type: 'number' },
        description: { type: 'string' },
        text: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.projectsService.update(id, updateProjectDto, file);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload image to project' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @UseGuards(JwtAuthGuard)
  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('files', 10))
  uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.projectsService.uploadImages(id, files);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete project image' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id/images/:imageId')
  removeImages(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.projectsService.removeImages(id, imageId);
  }
}
