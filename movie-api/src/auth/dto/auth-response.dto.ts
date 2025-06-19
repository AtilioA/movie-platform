import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User name' })
  name: string;

  @ApiProperty({ description: 'User creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'User last update timestamp' })
  updatedAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token for authentication' })
  accessToken: string;

  @ApiProperty({ description: 'User information' })
  user: UserResponse;

  @ApiProperty({ description: 'Token expiration in seconds' })
  expiresIn: number;

  constructor(partial: Partial<AuthResponseDto>) {
    Object.assign(this, partial);
  }
}
