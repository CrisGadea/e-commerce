import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailValidationService } from 'src/email-validation/email-validation.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, EmailValidationService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
