import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { AppError, IPaginationOptions } from '../../utils';
import { UserCompany } from '../entities';
import { CompanyService } from './company.service';
import { UserService } from '../../user/services';
import { CreateUserCompanyRequestDto } from '../dtos/request/create-user-company.request.dto';

@Injectable()
export class UserCompanyService {
  constructor(
    private readonly i18n: I18nService,

    @Inject(forwardRef(() => CompanyService))
    private companyService: CompanyService,

    @Inject(forwardRef(() => UserService))
    private userService: UserService,

    @InjectRepository(UserCompany)
    private userCompanyRepository: Repository<UserCompany>,
  ) {}

  async addUserCompany({
    dto,
    companyId,
  }: {
    dto: CreateUserCompanyRequestDto;
    companyId: string;
  }): Promise<UserCompany> {
    const foundCompany = await this.userCompanyRepository.findOne({
      where: {
        companyId: companyId,
        userId: dto.userId,
      },
    });

    if (foundCompany) {
      throw AppError(this.i18n, {
        status: HttpStatus.BAD_REQUEST,
        identifiers: ['company.already_added'],
      });
    }

    // make sure the company and user exists
    const company = await this.companyService.getCompany({ companyId });
    const user = await this.userService.getUser({ userId: dto.userId });

    const addedCompany = await this.userCompanyRepository.save(
      this.userCompanyRepository.create({
        companyId: company.id,
        userId: user.id,
      }),
    );

    return addedCompany;
  }

  async deleteUserCompany({
    userId,
    companyId,
  }: {
    userId: string;
    companyId: string;
  }): Promise<void> {
    // make sure the user exists
    const user = await this.userService.getUser({ userId });

    const userCompany = await this.userCompanyRepository.findOne({
      where: {
        companyId: companyId,
        userId: user.id,
      },
    });

    if (!userCompany) {
      throw AppError(this.i18n, {
        status: HttpStatus.BAD_REQUEST,
        identifiers: ['company.not_found'],
      });
    }

    await this.userCompanyRepository.delete({
      id: userCompany.id,
    });

    return;
  }

  async getUserCompany({
    userId,
    paginationOptions,
  }: {
    userId: string;
    paginationOptions: IPaginationOptions;
  }): Promise<[UserCompany[], number]> {
    const userCompanies = await this.userCompanyRepository.findAndCount({
      where: {
        userId,
      },
      relations: ['company'],
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return userCompanies;
  }
}
