import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email користувача' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'securePassword123', description: 'Пароль (мінімум 6 символів)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Doe', description: "Ім'я користувача" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '+380501234567', description: 'Номер телефону' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
