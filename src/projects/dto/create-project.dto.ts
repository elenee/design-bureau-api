import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { ProjectStatus } from '../enums/project-status.enum';
import { ProjectCategory } from '../enums/project-catgeroy.enum';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  subtitle: string;
  @IsNotEmpty()
  @IsString()
  location: string;
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  year: number;
  @IsNotEmpty()
  @IsEnum(ProjectCategory)
  category: ProjectCategory;
  @IsNotEmpty()
  @IsString()
  program: string;
  @IsNotEmpty()
  @IsEnum(ProjectStatus)
  status: ProjectStatus;
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  area: number;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsString()
  text: string;
}
