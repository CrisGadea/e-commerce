import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailValidationService } from 'src/email-validation/email-validation.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repository: Repository<User>,
    private emailValidationService: EmailValidationService,
  ) {}

  async createUser(user: CreateUserDto) {
    const userFound = await this.repository.findOne({
      where: {
        username: user.username,
      },
    });

    if (userFound) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    }

    const isEmailValid = this.emailValidationService.isEmailValid(user.email);
    if (!isEmailValid) {
      throw new HttpException('Invalid email format', HttpStatus.BAD_REQUEST);
    }

    const emailFound = await this.repository.findOne({
      where: {
        email: user.email,
      },
    });

    if (emailFound) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(user.password, 12); // Hashear la contraseña antes de guardarla
    const newUser = this.repository.create({
      ...user,
      password: hashedPassword,
    });

    return this.repository.save(newUser);
  }

  getUsers() {
    return this.repository.find();
  }

  async getUser(id: number) {
    const userFound = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return userFound;
  }

  async updateUser(id: number, user: UpdateUserDto) {
    const hashedPassword = await bcrypt.hash(user.password, 10); // Hashear la nueva contraseña
    const usuario = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!usuario) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    usuario.password = hashedPassword; // Asignar la nueva contraseña hasheada al usuario
    return this.repository.save(usuario);
  }

  async deleteUser(id: number) {
    const result = await this.repository.delete({ id });

    if (result.affected === 0) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }
}
