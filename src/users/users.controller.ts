import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.service.getUsers();
  }

  @Get(':id') // ParseIntPipe convierte a number el string recibido
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.service.getUser(id);
  }

  @Post()
  createUser(@Body() newUser: CreateUserDto) {
    return this.service.createUser(newUser);
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ) {
    return this.service.updateUser(id, user);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    this.service.deleteUser(id);
  }
}
