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
} from '@nestjs/common';
import { TeamMembersService } from './team-members.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('team-members')
export class TeamMembersController {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create team member' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'position', 'expertise', 'location', 'file'],
      properties: {
        name: { type: 'string', minLength: 3, maxLength: 30 },
        position: { type: 'string', minLength: 3, maxLength: 20 },
        expertise: { type: 'string', minLength: 3, maxLength: 30 },
        location: { type: 'string', minLength: 3, maxLength: 30 },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        _id: '69a01dd6a637e0886f1b0e9e',
        name: 'Nia',
        expertise: 'Interior',
        location: 'Tbilisi, Georgia',
        position: 'co founder',
        url: 'https://design-bureau-media.s3.amazonaws.com/team-members/bdea0ef4-b3c3-48ca-8db3-3646964bd950.jpeg',
        key: 'team-members/bdea0ef4-b3c3-48ca-8db3-3646964bd950.jpeg',
        createdAt: '2026-02-26T10:17:58.504Z',
        updatedAt: '2026-02-26T10:17:58.504Z',
        __v: 0,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createTeamMemberDto: CreateTeamMemberDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.teamMembersService.create(createTeamMemberDto, file);
  }

  @ApiOperation({ summary: 'Get all team members' })
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          _id: '69a01dd6a637e0886f1b0e9e',
          name: 'Nia',
          expertise: 'Interior',
          location: 'Tbilisi, Georgia',
          position: 'co founder',
          url: 'https://design-bureau-media.s3.amazonaws.com/team-members/bdea0ef4-b3c3-48ca-8db3-3646964bd950.jpeg',
          key: 'team-members/bdea0ef4-b3c3-48ca-8db3-3646964bd950.jpeg',
          createdAt: '2026-02-26T10:17:58.504Z',
          updatedAt: '2026-02-26T10:17:58.504Z',
          __v: 0,
        },
      ],
    },
  })
  @Get()
  findAll() {
    return this.teamMembersService.findAll();
  }

  @ApiOperation({ summary: 'Get team member by id' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        _id: '69a01dd6a637e0886f1b0e9e',
        name: 'Nia',
        expertise: 'Interior',
        location: 'Tbilisi, Georgia',
        position: 'co founder',
        url: 'https://design-bureau-media.s3.amazonaws.com/team-members/bdea0ef4-b3c3-48ca-8db3-3646964bd950.jpeg',
        key: 'team-members/bdea0ef4-b3c3-48ca-8db3-3646964bd950.jpeg',
        createdAt: '2026-02-26T10:17:58.504Z',
        updatedAt: '2026-02-26T10:17:58.504Z',
        __v: 0,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamMembersService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete team member' })
  @ApiResponse({ status: 200, description: 'Team member deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamMembersService.remove(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update team member' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 3, maxLength: 30 },
        position: { type: 'string', minLength: 3, maxLength: 20 },
        expertise: { type: 'string', minLength: 3, maxLength: 30 },
        location: { type: 'string', minLength: 3, maxLength: 30 },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Team member updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateTeamMemberDto: UpdateTeamMemberDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.teamMembersService.update(id, updateTeamMemberDto, file);
  }
}
