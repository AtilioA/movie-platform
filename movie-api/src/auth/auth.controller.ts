import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Req,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  Logger,
  ConflictException,
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto, UserResponse } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../shared/decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully logged in',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials'
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    this.logger.log(`Login attempt for email: ${loginDto.email}`);
    try {
      const result = await this.authService.login(loginDto);
      this.logger.log(`Successful login for user: ${loginDto.email}`);
      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        this.logger.warn(`Failed login attempt for email: ${loginDto.email}`);
        throw error;
      }
      this.logger.error(`Login error for ${loginDto.email}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Login failed');
    }
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already in use'
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    this.logger.log(`Registration attempt for email: ${registerDto.email}`);
    try {
      const result = await this.authService.register(registerDto);
      this.logger.log(`User registered successfully: ${registerDto.email}`);
      return result;
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        this.logger.warn(`Registration failed for ${registerDto.email}: ${error.message}`);
        throw error;
      }
      this.logger.error(`Registration error for ${registerDto.email}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Registration failed');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the authenticated user\'s profile',
    type: UserResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  getProfile(@Req() req: any) {
    this.logger.log(`Fetching profile for user ID: ${req.user?.userId}`);
    try {
      // The JWT guard has already verified the token and attached the user
      if (!req.user) {
        this.logger.warn('Unauthorized profile access attempt');
        throw new UnauthorizedException('User not authenticated');
      }
      this.logger.debug(`Profile data retrieved for user ID: ${req.user.userId}`);
      return req.user;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      this.logger.error(`Error fetching profile: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch profile');
    }
  }
}
