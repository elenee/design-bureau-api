import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTeamMemberDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 30)
  name: string;
  @IsNotEmpty()
  @IsString()
  @Length(3, 30)
  expertise: string;
  @IsNotEmpty()
  @IsString()
  @Length(3, 30)
  location: string;
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  position: string;
}
