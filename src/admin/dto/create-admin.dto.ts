import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  password: string;
}
