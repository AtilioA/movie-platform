import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class MovieActorResponseDto {
  @ApiProperty({ description: 'The unique identifier of the actor' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'The name of the actor' })
  name: string;

  @ApiProperty({ description: 'The date when the actor was created' })
  createdAt: Date;

  @ApiProperty({ description: 'The date when the actor was last updated' })
  updatedAt: Date;
}
