import { ApiProperty } from '@nestjs/swagger';

export class QrPayloadResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT токен для QR-коду (дійсний 5 хвилин)',
  })
  qr_payload: string;
}
