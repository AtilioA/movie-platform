import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateActorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
