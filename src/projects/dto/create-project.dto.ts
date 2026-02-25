import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 30)
  name: string;
}
