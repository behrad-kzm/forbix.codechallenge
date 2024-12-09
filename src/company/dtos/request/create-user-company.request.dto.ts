import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUserCompanyRequestDto {
  @ApiProperty({ example: 'userId' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
