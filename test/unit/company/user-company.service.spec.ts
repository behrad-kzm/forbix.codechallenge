import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Company, UserCompany } from '../../../src/company/entities';
import { CompanyService } from '../../../src/company/services/company.service';
import { UserService } from '../../../src/user/services';
import { UserCompanyService } from '../../../src/company/services';
import {  IPaginationOptions } from '../../../src/utils';
import { plainToInstance } from 'class-transformer';
import { faker } from '@faker-js/faker';
import { HttpException } from '@nestjs/common';
import { User } from '../../../src/user/entities';

describe('UserCompanyService', () => {
  let service: UserCompanyService;
  let repository: jest.Mocked<Repository<UserCompany>>;
  let i18nService: jest.Mocked<I18nService>;
  let companyService: jest.Mocked<CompanyService>;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn(),
      findAndCount: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const mockI18nService = {
      t: jest.fn((key) => key),
    };

    const mockCompanyService = {
      getCompany: jest.fn(),
    };

    const mockUserService = {
      getUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCompanyService,
        { provide: getRepositoryToken(UserCompany), useValue: mockRepository },
        { provide: I18nService, useValue: mockI18nService },
        { provide: CompanyService, useValue: mockCompanyService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<UserCompanyService>(UserCompanyService);
    repository = module.get(getRepositoryToken(UserCompany));
    i18nService = module.get(I18nService);
    companyService = module.get(CompanyService);
    userService = module.get(UserService);
  });

  describe('addUserCompany', () => {
    it('should throw an error if the user company already exists', async () => {
      const dto = { userId: faker.string.uuid() };
      const companyId = faker.string.uuid();

      repository.findOne.mockResolvedValueOnce(plainToInstance(UserCompany, {}));

      await expect(
        service.addUserCompany({ dto, companyId }),
      ).rejects.toThrow(HttpException);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { companyId, userId: dto.userId },
      });
    });

    it('should save a new user company if it does not already exist', async () => {
      const dto = { userId: faker.string.uuid() };
      const companyId = faker.string.uuid();
      const mockCompany = plainToInstance(Company, { id: companyId, name: faker.company.name() });
      const mockUser = plainToInstance(User, { id: dto.userId, name: faker.internet.userName(), email: faker.internet.email() });
      const mockSavedCompany = plainToInstance(UserCompany, {
        companyId,
        userId: dto.userId,
      });

      repository.findOne.mockResolvedValueOnce(null);
      companyService.getCompany.mockResolvedValueOnce(mockCompany);
      userService.getUser.mockResolvedValueOnce(mockUser);
      repository.create.mockReturnValueOnce(mockSavedCompany);
      repository.save.mockResolvedValueOnce(mockSavedCompany);

      const result = await service.addUserCompany({ dto, companyId });

      expect(companyService.getCompany).toHaveBeenCalledWith({ companyId });
      expect(userService.getUser).toHaveBeenCalledWith({ userId: dto.userId });
      expect(repository.create).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        userId: mockUser.id,
      });
      expect(repository.save).toHaveBeenCalledWith(mockSavedCompany);
      expect(result).toEqual(mockSavedCompany);
    });
  });

  describe('deleteUserCompany', () => {
    it('should throw an error if the user company does not exist', async () => {
      const userId = faker.string.uuid();
      const companyId = faker.string.uuid();
      const mockUser = plainToInstance(User, { id: userId, name: faker.internet.userName(), email: faker.internet.email() });


      userService.getUser.mockResolvedValueOnce(mockUser);
      repository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.deleteUserCompany({ userId, companyId }),
      ).rejects.toThrow(HttpException);

      expect(userService.getUser).toHaveBeenCalledWith({ userId });
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { companyId, userId: mockUser.id },
      });
    });

    it('should delete the user company if it exists', async () => {
      const userId = faker.string.uuid();
      const companyId = faker.string.uuid();
      const mockUser = plainToInstance(User, { id: userId, name: faker.internet.userName(), email: faker.internet.email() });

      const mockUserCompany = plainToInstance(UserCompany, { id: faker.string.uuid() });

      userService.getUser.mockResolvedValueOnce(mockUser);
      repository.findOne.mockResolvedValueOnce(mockUserCompany);

      await service.deleteUserCompany({ userId, companyId });

      expect(repository.delete).toHaveBeenCalledWith({ id: mockUserCompany.id });
    });
  });

  describe('getUserCompany', () => {
    it('should return a list of user companies with pagination', async () => {
      const userId = faker.string.uuid();
      const paginationOptions: IPaginationOptions = { page: 1, limit: 10 };
      const mockUserCompanies = [
        plainToInstance(UserCompany, { id: faker.string.uuid() }),
      ];
      const mockCount = mockUserCompanies.length;

      repository.findAndCount.mockResolvedValueOnce([mockUserCompanies, mockCount]);

      const result = await service.getUserCompany({ userId, paginationOptions });

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { userId },
        relations: ['company'],
        skip: 0,
        take: paginationOptions.limit,
      });
      expect(result).toEqual([mockUserCompanies, mockCount]);
    });
  });
});
