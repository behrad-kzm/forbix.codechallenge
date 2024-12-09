import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/user/services/user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { User } from '../../../src/user/entities/user.entity';
import { CreateUserRequestDto } from '../../../src/user/dtos/request/create-user.request.dto';
import { faker } from '@faker-js/faker';
import { AppError } from '../../../src/utils';
import { HttpStatus } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let i18nService: I18nService;

  beforeEach(async () => {
    const mockUserRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn((user) => user),
    };

    const mockI18nService = {
      t: jest.fn((key) => key),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: I18nService, useValue: mockI18nService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    i18nService = module.get<I18nService>(I18nService);
  });

  describe('createUser', () => {
    it('should create a new user when email does not exist', async () => {
      const dto: CreateUserRequestDto = { 
        name: faker.person.fullName(), 
        email: faker.internet.email() 
      };
      const mockUser = plainToInstance(User, { id: faker.string.uuid(), ...dto });

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const result = await service.createUser(dto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(userRepository.create).toHaveBeenCalledWith(dto);
      expect(userRepository.save).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error when email already exists', async () => {
      const dto: CreateUserRequestDto = { 
        name: faker.person.fullName(), 
        email: faker.internet.email() 
      };
      const existingUser = plainToInstance(User, { id: faker.string.uuid(), ...dto });

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(existingUser);

      await expect(service.createUser(dto)).rejects.toThrowError(
        AppError(i18nService, {
          status: HttpStatus.BAD_REQUEST,
          identifiers: ['user.email_already_exists'],
        }),
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('should return a user when a valid ID is provided', async () => {
      const userId = faker.string.uuid();
      const mockUser = plainToInstance(User, { id: userId, name: faker.person.fullName(), email: faker.internet.email() });

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const result = await service.getUser({ userId });

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw an error when user is not found', async () => {
      const userId = faker.string.uuid();

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getUser({ userId })).rejects.toThrowError(
        AppError(i18nService, {
          status: HttpStatus.BAD_REQUEST,
          identifiers: ['user.not_found'],
        }),
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });
});
