import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsUUID, Matches, Min } from 'class-validator';

export class TransferPointsDto {
  @ApiProperty({
    description: 'UUID відправника (ID користувача, що списує бали)',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'senderId must be a valid UUID' })
  senderId!: string;

  @ApiProperty({
    description: 'Номер телефону отримувача у форматі E.164',
    example: '+380501110002',
  })
  @IsString()
  @Matches(/^\+?\d{10,15}$/, {
    message: 'receiverPhone must be E.164-like (e.g. +380501110002)',
  })
  receiverPhone!: string;

  @ApiProperty({
    description: 'UUID закладу, у межах якого відбувається переказ',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID('4', { message: 'merchantId must be a valid UUID' })
  merchantId!: string;

  @ApiProperty({
    description: 'Кількість балів для переказу (ціле число, більше нуля)',
    minimum: 1,
    example: 50,
  })
  @IsInt({ message: 'amount must be an integer' })
  @Min(1, { message: 'amount must be positive (>= 1)' })
  amount!: number;
}
