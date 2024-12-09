import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsEmail, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserRequestDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsAlpha()
  name: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}
