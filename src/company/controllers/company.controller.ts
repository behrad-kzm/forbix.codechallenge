import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  getSanitizedPageAndLimit,
  infinityPagination,
  ParseRequiredUUIDPipe,
} from '../../utils';
import { CompanyService } from '../services/company.service';
import { CompanyResponseDto, CreateCompanyRequestDto } from '../dtos';

@ApiTags('Company')
@Controller({
  version: '1',
  path: 'company',
})
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCompany(
    @Body() dto: CreateCompanyRequestDto,
  ): Promise<CompanyResponseDto> {
    const result = await this.service.createCompany(dto);
    return new CompanyResponseDto(result);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'between 1 to 50',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'starts from 1',
  })
  async getAllCompanies(
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<{
    data: CompanyResponseDto[];
    count: number;
    hasNextPage: boolean;
  }> {
    const paginationOptions = getSanitizedPageAndLimit({
      page,
      limit,
    });

    const result = await this.service.pageCompanies({
      paginationOptions,
    });

    return infinityPagination(
      result[0].map((company) => new CompanyResponseDto(company)),
      result[1],
      paginationOptions,
    );
  }

  @Get(':companyId')
  @HttpCode(HttpStatus.OK)
  async getCompany(
    @Param('companyId', ParseRequiredUUIDPipe) companyId: string,
  ): Promise<CompanyResponseDto> {
    const result = await this.service.getCompany({ companyId });
    return new CompanyResponseDto(result);
  }
}
