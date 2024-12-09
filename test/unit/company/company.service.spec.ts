import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { CompanyService } from '../../../src/company/services';
import { Company } from '../../../src/company/entities';
import { CreateCompanyRequestDto } from '../../../src/company/dtos';
import { plainToInstance } from 'class-transformer';
import { faker } from '@faker-js/faker';

describe('CompanyService', () => {
  let service: CompanyService;
  let companyRepository: Repository<Company>;
  let i18nService: I18nService;

  beforeEach(async () => {
    const mockCompanyRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findAndCount: jest.fn(),
    };

    const mockI18nService = {
      t: jest.fn().mockImplementation((key) => key),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        { provide: getRepositoryToken(Company), useValue: mockCompanyRepository },
        { provide: I18nService, useValue: mockI18nService },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    companyRepository = module.get<Repository<Company>>(getRepositoryToken(Company));
    i18nService = module.get<I18nService>(I18nService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCompany', () => {
    it('should throw an error if company already exists', async () => {
      const dto: CreateCompanyRequestDto = { name: 'Existing Company' };
      jest.spyOn(companyRepository, 'findOne').mockResolvedValue(plainToInstance(Company, { id: faker.string.uuid(), name: dto.name }));

      await expect(service.createCompany(dto)).rejects.toThrow(
        expect.objectContaining({
          status: HttpStatus.BAD_REQUEST,
        }),
      );

      expect(companyRepository.findOne).toHaveBeenCalledWith({
        where: { name: dto.name },
      });
    });

    it('should create and return a new company', async () => {
      const dto: CreateCompanyRequestDto = { name: faker.company.name() };
      const mockCompany = plainToInstance(Company, { id: faker.string.uuid(), name: dto.name });
      jest.spyOn(companyRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(companyRepository, 'create').mockReturnValue(mockCompany);
      jest.spyOn(companyRepository, 'save').mockResolvedValue(mockCompany);

      const result = await service.createCompany(dto);

      expect(companyRepository.findOne).toHaveBeenCalledWith({
        where: { name: dto.name },
      });
      expect(companyRepository.create).toHaveBeenCalledWith({ name: dto.name });
      expect(companyRepository.save).toHaveBeenCalledWith(mockCompany);
      expect(result).toEqual(mockCompany);
    });
  });

  describe('getCompany', () => {
    it('should throw an error if company does not exist', async () => {
      const nonExistingCompanyId = faker.string.uuid();
      jest.spyOn(companyRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getCompany({ companyId: nonExistingCompanyId })).rejects.toThrow(
        expect.objectContaining({
          status: HttpStatus.BAD_REQUEST,
        }),
      );

      expect(companyRepository.findOne).toHaveBeenCalledWith({
        where: { id: nonExistingCompanyId },
      });
    });

    it('should return the company if it exists', async () => {
      const existingCompanyId = faker.string.uuid();
      const mockCompany = plainToInstance(Company, { id: existingCompanyId, name: faker.company.name() });
      jest.spyOn(companyRepository, 'findOne').mockResolvedValue(mockCompany);

      const result = await service.getCompany({ companyId: existingCompanyId });

      expect(companyRepository.findOne).toHaveBeenCalledWith({
        where: { id: existingCompanyId },
      });
      expect(result).toEqual(mockCompany);
    });
  });

  describe('pageCompanies', () => {
    it('should return companies and count', async () => {
      const paginationOptions = { page: 1, limit: 10 };
      const mockCompanies = [
        plainToInstance(Company, { id: faker.string.uuid(), name: faker.company.name() }),
        plainToInstance(Company, { id: faker.string.uuid(), name: faker.company.name() }),
      ];
      const mockCount = 2;

      jest.spyOn(companyRepository, 'findAndCount').mockResolvedValue([mockCompanies, mockCount]);

      const result = await service.pageCompanies({ paginationOptions });

      expect(companyRepository.findAndCount).toHaveBeenCalledWith({
        skip: (paginationOptions.page - 1) * paginationOptions.limit,
        take: paginationOptions.limit,
      });
      expect(result).toEqual([mockCompanies, mockCount]);
    });
  });
});
