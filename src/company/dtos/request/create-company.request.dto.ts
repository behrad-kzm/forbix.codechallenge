import { ApiProperty } from '@nestjs/swagger';
import { TransformFnParams, Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCompanyRequestDto {
  @ApiProperty({ example: 'awesome-company' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(3, 50)
  name: string;
}
