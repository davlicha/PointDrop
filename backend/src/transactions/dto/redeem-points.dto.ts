import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class RedeemPointsDto {
  @ApiProperty({
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    description: 'UUID користувача',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    description: 'UUID мерчанта',
  })
  @IsUUID()
  @IsNotEmpty()
  merchantId: string;

  @ApiProperty({
    example: 100,
    description: 'Кількість балів для списання',
  })
  @IsNumber()
  @IsPositive()
  requestedPoints: number;
}
