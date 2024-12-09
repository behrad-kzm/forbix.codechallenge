import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
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
  IPaginationOptions,
  ParseRequiredUUIDPipe,
} from '../../utils';
import { UserCompanyService } from '../services';
import {
  CompanyResponseDto,
  CreateUserCompanyRequestDto,
  UserCompanyResponseDto,
} from '../dtos';

@ApiTags('User Company')
@Controller({
  version: '1',
  path: 'company',
})
export class UserCompanyController {
  constructor(private readonly service: UserCompanyService) {}

  @Get('user/:userId')
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
  async getUserCompany(
    @Param('userId', ParseRequiredUUIDPipe) userId: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<{
    data: CompanyResponseDto[];
    count: number;
    hasNextPage: boolean;
  }> {
    const paginationOptions: IPaginationOptions = getSanitizedPageAndLimit({
      page,
      limit,
    });
    const result = await this.service.getUserCompany({
      userId,
      paginationOptions,
    });
    return infinityPagination(
      result[0].flatMap(
        (userCompany) => new CompanyResponseDto(userCompany.company),
      ),
      result[1],
      paginationOptions,
    );
  }

  @Post(':companyId/user')
  @HttpCode(HttpStatus.OK)
  async addUserCompany(
    @Param('companyId', ParseRequiredUUIDPipe) companyId: string,
    @Body() dto: CreateUserCompanyRequestDto,
  ): Promise<UserCompanyResponseDto> {
    const result = await this.service.addUserCompany({ companyId, dto });
    return new UserCompanyResponseDto(result);
  }

  @Delete(':companyId/user/:userId')
  @HttpCode(HttpStatus.OK)
  async deleteUserCompany(
    @Param('userId', ParseRequiredUUIDPipe) userId: string,
    @Param('companyId', ParseRequiredUUIDPipe) companyId: string,
  ): Promise<void> {
    await this.service.deleteUserCompany({ userId, companyId });
    return;
  }
}
