import { plainToInstance } from 'class-transformer';
import {
  CompanyResponseDto,
  CreateCompanyRequestDto,
} from '../../../src/company/dtos';
import { Company } from '../../../src/company/entities';
import { infinityPagination } from '../../../src/utils';
import { CompanyController } from '../../../src/company/controllers';
import { CompanyService } from '../../../src/company/services';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { validate } from 'class-validator';

describe('CompanyController', () => {
  let controller: CompanyController;
  let service: jest.MockedObject<CompanyService>;
  beforeEach(async () => {
    const mockCompanyService = {
      createCompany: jest.fn(),
      pageCompanies: jest.fn(),
      getCompany: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: CompanyService,
          useValue: mockCompanyService,
        },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
    service = module.get(CompanyService);
  });

  describe('createCompany', () => {
    it('DTO should throw error when name is empty', async () => {
      const dto = plainToInstance(CreateCompanyRequestDto, { name: '' });
      const errors = await validate(dto);
      expect(JSON.stringify(errors)).toContain('name should not be empty');
    });

    it('should pass the dto to the service', async () => {
      const dto: CreateCompanyRequestDto = { name: faker.company.name() };
      const mockResponse = plainToInstance(Company, {
        id: faker.string.uuid(),
        name: dto.name,
      });

      jest.spyOn(service, 'createCompany').mockResolvedValue(mockResponse);

      const result = await controller.createCompany(dto);

      expect(service.createCompany).toHaveBeenCalledWith(dto);
      expect(result).toEqual(new CompanyResponseDto(mockResponse));
    });

    it('should map the service return value (Company) to CompanyResponseDto', async () => {
      const dto: CreateCompanyRequestDto = { name: faker.company.name() };
      const mockCompany = plainToInstance(Company, {
        id: faker.string.uuid(),
        name: dto.name,
      });
  
      jest.spyOn(service, 'createCompany').mockResolvedValue(mockCompany);
  
      const result = await controller.createCompany(dto);
  
      // Ensure the service was called with the correct input
      expect(service.createCompany).toHaveBeenCalledWith(dto);
  
      // Validate the mapping of the returned value to CompanyResponseDto
      expect(result).toBeInstanceOf(CompanyResponseDto);
      expect(result.id).toEqual(mockCompany.id);
      expect(result.name).toEqual(mockCompany.name);
    });
  });

  describe('getAllCompanies', () => {
    it('should pass 50 as limit and 1 as page when query parameters are empty', async () => {
      const mockCompanies = [];
      const mockCount = 0;

      jest
        .spyOn(service, 'pageCompanies')
        .mockResolvedValue([mockCompanies, mockCount]);

      const result = await controller.getAllCompanies(undefined, undefined);

      expect(service.pageCompanies).toHaveBeenCalledWith({
        paginationOptions: { page: 1, limit: 50 },
      });
      expect(result).toEqual(
        infinityPagination(
          mockCompanies,
          mockCount,
          { page: 1, limit: 50 },
        ),
      );
    });

    it('should pass the exact limit value to the service when it is between 1 and 50', async () => {
      const mockCompanies = [];
      const mockCount = 0;

      jest
        .spyOn(service, 'pageCompanies')
        .mockResolvedValue([mockCompanies, mockCount]);

      const result = await controller.getAllCompanies(25, 1);

      expect(service.pageCompanies).toHaveBeenCalledWith({
        paginationOptions: { page: 1, limit: 25 },
      });
      expect(result).toEqual(
        infinityPagination(
          mockCompanies,
          mockCount,
          { page: 1, limit: 25 },
        ),
      );
    });

    it('should map each Company to a CompanyResponseDto in the response', async () => {
      const mockCompanies = [
        plainToInstance(Company, {
          id: faker.string.uuid(),
          name: faker.company.name(),
        }),
        plainToInstance(Company, {
          id: faker.string.uuid(),
          name: faker.company.name(),
        }),
      ];
      const mockCount = mockCompanies.length;
  
      jest
        .spyOn(service, 'pageCompanies')
        .mockResolvedValue([mockCompanies, mockCount]);
  
      const result = await controller.getAllCompanies(10, 1);
  
      // Ensure the service was called with correct pagination options
      expect(service.pageCompanies).toHaveBeenCalledWith({
        paginationOptions: { page: 1, limit: 10 },
      });
  
      // Validate the structure of the response
      expect(result.data).toHaveLength(mockCompanies.length);
      result.data.forEach((dto, index) => {
        const mockCompany = mockCompanies[index];
        expect(dto).toBeInstanceOf(CompanyResponseDto);
        expect(dto.id).toEqual(mockCompany.id);
        expect(dto.name).toEqual(mockCompany.name);
      });
  
      // Validate pagination metadata
      expect(result.count).toEqual(mockCount);
      expect(result.hasNextPage).toEqual(false);
    });
  });

  describe('getCompany', () => {
    it('should pass the parameters to the service when companyId is valid', async () => {
      const companyId = faker.string.uuid();
      const mockCompany = plainToInstance(Company, {
        id: companyId,
        name: faker.company.name(),
      });

      jest.spyOn(service, 'getCompany').mockResolvedValue(mockCompany);

      const result = await controller.getCompany(companyId);

      expect(service.getCompany).toHaveBeenCalledWith({ companyId });
      expect(result).toEqual(new CompanyResponseDto(mockCompany));
    });

    it('should map the service return value (Company) to CompanyResponseDto', async () => {
      const companyId = faker.string.uuid();
      const mockCompany = plainToInstance(Company, {
        id: companyId,
        name: faker.company.name(),
      });
  
      jest.spyOn(service, 'getCompany').mockResolvedValue(mockCompany);
  
      const result = await controller.getCompany(companyId);
  
      // Validate mapping
      expect(result).toBeInstanceOf(CompanyResponseDto);
      expect(result.id).toEqual(mockCompany.id);
      expect(result.name).toEqual(mockCompany.name);
    });
  });
});
