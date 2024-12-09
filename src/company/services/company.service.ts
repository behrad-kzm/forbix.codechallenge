import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { AppError, IPaginationOptions } from '../../utils';
import { Company } from '../entities';
import { CreateCompanyRequestDto } from '../dtos/request/create-company.request.dto';

@Injectable()
export class CompanyService {
  constructor(
    private readonly i18n: I18nService,

    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async createCompany(dto: CreateCompanyRequestDto): Promise<Company> {
    const foundCompany = await this.companyRepository.findOne({
      where: {
        name: dto.name,
      },
    });

    if (foundCompany) {
      throw AppError(this.i18n, {
        status: HttpStatus.BAD_REQUEST,
        identifiers: ['company.already_exists'],
      });
    }

    const newCompany = await this.companyRepository.save(
      this.companyRepository.create({
        name: dto.name,
      }),
    );

    return newCompany;
  }

  async getCompany({ companyId }: { companyId: string }): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      throw AppError(this.i18n, {
        status: HttpStatus.BAD_REQUEST,
        identifiers: ['company.not_found'],
      });
    }

    return company;
  }

  async pageCompanies({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<[Company[], number]> {
    const companiesAndCount = await this.companyRepository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
    return companiesAndCount;
  }
}
