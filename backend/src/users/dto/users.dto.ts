import { ApiProperty } from '@nestjs/swagger';

export class UserSearchResponseDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', description: 'Унікальний ідентифікатор користувача' })
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'Ім\'я користувача' })
  name: string;

  @ApiProperty({ example: '+380501****67', description: 'Замаскований номер телефону користувача' })
  phone: string;
}

export class MakeMerchantResponseDto {
  @ApiProperty({ example: true, description: 'Статус виконання операції' })
  success: boolean;

  @ApiProperty({ example: 'Тепер ви мерчант!', description: 'Повідомлення про результат' })
  message: string;
}
