import {Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators';
import { AuthService } from './auth.service';
import {
  AuthResponseDto,
  LoginDto,
  QrPayloadResponseDto,
  RegisterDto,
  RegisterResponseDto,
} from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Реєстрація нового користувача',
    description: 'Створює нового користувача з роллю CUSTOMER за замовчуванням',
  })
  @ApiCreatedResponse({
    description: 'Користувача успішно створено',
    type: RegisterResponseDto,
  })
  @ApiConflictResponse({
    description: 'Користувач з таким email або телефоном вже існує',
  })
  async register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
    const user = await this.authService.register(dto);
    return {
      id: user.id,
      email: user.email ?? '',
      name: user.name,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Авторизація користувача',
    description: 'Повертає JWT access token для авторизованих запитів',
  })
  @ApiOkResponse({
    description: 'Успішна авторизація',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Невірний email або пароль',
  })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Отримання профілю поточного користувача',
    description: 'Повертає дані поточного авторизованого користувача',
  })
  @ApiOkResponse({
    description: 'Профіль користувача успішно отримано',
  })
  @ApiUnauthorizedResponse({
    description: 'Токен авторизації невалідний або відсутній',
  })
  getProfile(@CurrentUser('userId') userId: string) {
    return this.authService.getUserProfile(userId);
  }

  @Get('qr-payload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Генерація QR-payload',
    description: 'Генерує JWT токен для QR-коду з user_id та timestamp. Дійсний 5 хвилин.',
  })
  @ApiOkResponse({
    description: 'QR payload успішно згенеровано',
    type: QrPayloadResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Токен авторизації невалідний або відсутній',
  })
  getQrPayload(@CurrentUser('userId') userId: string): QrPayloadResponseDto {
    return this.authService.generateQrPayload(userId);
  }
}
