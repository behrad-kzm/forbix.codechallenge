import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { CreateUserRequestDto } from '../dtos/request/create-user.request.dto';
import { AppError } from '../../utils';

@Injectable()
export class UserService {
  constructor(
    private readonly i18n: I18nService,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(dto: CreateUserRequestDto): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (foundUser) {
      throw AppError(this.i18n, {
        status: HttpStatus.BAD_REQUEST,
        identifiers: ['user.email_already_exists'],
      });
    }

    const newUser = await this.userRepository.save(
      this.userRepository.create({
        name: dto.name,
        email: dto.email,
      }),
    );

    return newUser;
  }

  async getUser({ userId }: { userId: string }): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw AppError(this.i18n, {
        status: HttpStatus.BAD_REQUEST,
        identifiers: ['user.not_found'],
      });
    }

    return user;
  }
}
