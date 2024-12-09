import { Test, TestingModule } from '@nestjs/testing';
import { UserCompanyController } from '../../../src/company/controllers/user-company.controller';
import { UserCompanyService } from '../../../src/company/services/user-company.service';
import {
  CompanyResponseDto,
  CreateUserCompanyRequestDto,
  UserCompanyResponseDto,
} from '../../../src/company/dtos';
import { faker } from '@faker-js/faker';
import { plainToInstance } from 'class-transformer';
import { Company, UserCompany } from '../../../src/company/entities';
import { User } from '../../../src/user/entities';

describe('UserCompanyController', () => {
  let controller: UserCompanyController;
  let service: UserCompanyService;

  beforeEach(async () => {
    const mockService = {
      getUserCompany: jest.fn(),
      addUserCompany: jest.fn(),
      deleteUserCompany: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserCompanyController],
      providers: [{ provide: UserCompanyService, useValue: mockService }],
    }).compile();

    controller = module.get<UserCompanyController>(UserCompanyController);
    service = module.get<UserCompanyService>(UserCompanyService);
  });

  describe('getUserCompany', () => {
    it('should return paginated company data for a user', async () => {
      const userId = faker.string.uuid();
      const mockCompanies = [
        plainToInstance(UserCompany, { companyId: faker.string.uuid(), userId: faker.string.uuid(), company: plainToInstance(Company, { id: faker.string.uuid(), name: faker.company.name() }), }),
        plainToInstance(UserCompany, { companyId: faker.string.uuid(), userId: faker.string.uuid(), company: plainToInstance(Company, { id: faker.string.uuid(), name: faker.company.name() }), }),
      ];
      const count = mockCompanies.length;

      jest.spyOn(service, 'getUserCompany').mockResolvedValue([mockCompanies, count]);

      const result = await controller.getUserCompany(userId, 10, 1);

      expect(service.getUserCompany).toHaveBeenCalledWith({
        userId,
        paginationOptions: { page: 1, limit: 10 },
      });
      expect(result).toEqual({
        data: mockCompanies.map(
          (uc) => new CompanyResponseDto(uc.company),
        ),
        count,
        hasNextPage: false,
      });
    });
  });

  describe('addUserCompany', () => {
    it('should add a user to a company and return UserCompanyResponseDto', async () => {
      const companyId = faker.string.uuid();
      const dto = plainToInstance(CreateUserCompanyRequestDto, { userId: faker.string.uuid() });
      const mockUserCompany = plainToInstance(UserCompany, 
        {
          id: faker.string.uuid(),
          userId: faker.string.uuid(),
          companyId: faker.string.uuid(),
          user: plainToInstance(User, { id: dto.userId }),
          company: plainToInstance(Company, { id: companyId, name: faker.company.name() }),
        }
      );

      jest.spyOn(service, 'addUserCompany').mockResolvedValue(mockUserCompany);

      const result = await controller.addUserCompany(companyId, dto);

      expect(service.addUserCompany).toHaveBeenCalledWith({ companyId, dto });
      expect(result).toEqual(new UserCompanyResponseDto(mockUserCompany));
    });
  });

  describe('deleteUserCompany', () => {
    it('should call service to delete a user-company relationship', async () => {
      const userId = faker.string.uuid();
      const companyId = faker.string.uuid();

      jest.spyOn(service, 'deleteUserCompany').mockResolvedValue(undefined);

      const result = await controller.deleteUserCompany(userId, companyId);

      expect(service.deleteUserCompany).toHaveBeenCalledWith({ userId, companyId });
      expect(result).toBeUndefined();
    });
  });
});
