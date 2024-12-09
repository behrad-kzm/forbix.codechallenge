import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { UserController } from '../../../src/user/controllers';
import { UserService } from '../../../src/user/services';
import { CreateUserRequestDto } from '../../../src/user/dtos/request/create-user.request.dto';
import { plainToInstance } from 'class-transformer';
import { User } from '../../../src/user/entities';
import { UserResponseDto } from '../../../src/user/dtos/response/user.response.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const mockUserService = {
      createUser: jest.fn(),
      getUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('createUser', () => {
    it('should call service.createUser with correct data and return UserResponseDto', async () => {
      const dto: CreateUserRequestDto = plainToInstance(CreateUserRequestDto, { email: faker.internet.email() ,name: faker.internet.userName() });
      const mockUser = plainToInstance(User, { id: faker.string.uuid(), ...dto });
      jest.spyOn(userService, 'createUser').mockResolvedValue(mockUser);

      const result = await controller.createUser(dto);

      expect(userService.createUser).toHaveBeenCalledWith(dto);
      expect(result).toEqual(new UserResponseDto(mockUser));
    });
  });

  describe('getUser', () => {
    it('should call service.getUser with correct userId and return UserResponseDto', async () => {
      const userId = faker.string.uuid();
      const mockUser = plainToInstance(User,{ id: userId, name: faker.internet.displayName() });
      jest.spyOn(userService, 'getUser').mockResolvedValue(mockUser);

      const result = await controller.getUser(userId);

      expect(userService.getUser).toHaveBeenCalledWith({ userId });
      expect(result).toEqual(new UserResponseDto(mockUser));
    });
  });
});
