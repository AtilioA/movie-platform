import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { UserSubscriber } from './subscribers/user.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService, UserSubscriber],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
