import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class EarnPointsDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'QR payload токен користувача',
  })
  @IsString()
  @IsNotEmpty()
  qrPayload: string;

  @ApiProperty({
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    description: 'UUID мерчанта',
  })
  @IsUUID()
  @IsNotEmpty()
  merchantId: string;

  @ApiProperty({
    example: 150.5,
    description: 'Сума покупки (гривні)',
  })
  @IsNumber()
  @IsPositive()
  amountSpent: number;
}
