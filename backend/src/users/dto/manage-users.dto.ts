import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsUUID, Min } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'Нова роль користувача',
    enum: Role,
    example: Role.CASHIER,
  })
  @IsEnum(Role, { message: 'role must be a valid enum value (CUSTOMER, CASHIER, ADMIN)' })
  role!: Role;
}

export class UpdateBalanceDto {
  @ApiProperty({
    description: 'ID закладу, для якого змінюється баланс',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'merchantId must be a valid UUID' })
  merchantId!: string;

  @ApiProperty({
    description: 'Нове значення балансу (ціле число >= 0)',
    minimum: 0,
    example: 100,
  })
  @IsInt({ message: 'balance must be an integer' })
  @Min(0, { message: 'balance must be non-negative' })
  balance!: number;
}
