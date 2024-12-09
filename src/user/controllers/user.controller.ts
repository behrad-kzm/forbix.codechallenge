import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserRequestDto } from '../dtos/request/create-user.request.dto';
import { UserResponseDto } from '../dtos/response/user.response.dto';
import { ParseRequiredUUIDPipe } from '../../utils';

@ApiTags('User')
@Controller({
  version: '1',
  path: 'user',
})
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() dto: CreateUserRequestDto,
  ): Promise<UserResponseDto> {
    const result = await this.service.createUser(dto);
    return new UserResponseDto(result);
  }

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  async getUser(
    @Param('userId', ParseRequiredUUIDPipe) userId: string,
  ): Promise<UserResponseDto> {
    const result = await this.service.getUser({ userId });
    return new UserResponseDto(result);
  }
}
