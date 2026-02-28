import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ProjectCategory } from 'src/projects/enums/project-catgeroy.enum';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(ProjectCategory)
  interestedIn: ProjectCategory;

  @IsNotEmpty()
  @IsString()
  message: string;
}
