import { BadRequestException, Controller, Get, Post, Request, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UserSearchResponseDto, MakeMerchantResponseDto } from './dto';

@ApiTags('users')
@ApiInternalServerErrorResponse({ description: 'Внутрішня помилка сервера' })
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
  @ApiOkResponse({ description: 'Результати пошуку користувачів', type: [UserSearchResponseDto] })
  @ApiBadRequestResponse({ description: 'Невалідні параметри запиту' })
  @ApiUnauthorizedResponse({ description: 'Токен авторизації невалідний або відсутній' })
  @ApiForbiddenResponse({ description: 'Доступ заборонено' })
  async searchUsers(
    @Query('phone') phone: string,
    @Query('merchantId') merchantId: string,
  ): Promise<UserSearchResponseDto[]> {
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
  @ApiOkResponse({ description: 'Користувач успішно отримав роль мерчанта', type: MakeMerchantResponseDto })
  @ApiUnauthorizedResponse({ description: 'Токен авторизації невалідний або відсутній' })
  @ApiForbiddenResponse({ description: 'Доступ заборонено' })
  async makeMeMerchant(@Request() req: any): Promise<MakeMerchantResponseDto> {
    return this.usersService.makeUserMerchant(req.user.id);
  }
}
