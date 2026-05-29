import { BadRequestException, Controller, Get, Post, Request, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Пошук користувачів',
    description: 'Шукає користувачів за частковим збігом номера телефону в межах конкретного мерчанта.',
  })
  @ApiQuery({ name: 'phone', required: true, description: 'Номер телефону для пошуку' })
  @ApiQuery({ name: 'merchantId', required: true, description: 'ID мерчанта' })
  async searchUsers(
    @Query('phone') phone: string,
    @Query('merchantId') merchantId: string,
  ) {
    if (!phone || !merchantId) {
      throw new BadRequestException('Параметри phone та merchantId є обов\'язковими');
    }

    const users = await this.usersService.searchUsers(phone, merchantId);

    if (users.length === 0) {
      // Returning empty array is standard, but the AC says: "користувачу відображається повідомлення 'Користувача не знайдено в системі цього закладу'". We can handle this in frontend by checking if array is empty.
    }

    return users;
  }

  @Post('make-me-merchant')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Тестовий ендпоінт: Зробити мене мерчантом',
    description: 'Надає поточному користувачу роль ADMIN і створює для нього тестовий заклад.',
  })
  async makeMeMerchant(@Request() req: any) {
    return this.usersService.makeUserMerchant(req.user.id);
  }
}
