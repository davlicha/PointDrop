import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string;
  role: Role;
}

export interface QrPayload {
  user_id: string;
  timestamp: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly SALT_ROUNDS = 10;
  private readonly QR_TOKEN_EXPIRES_IN = '5m';

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<Omit<User, 'passwordHash'>> {
    this.logger.log(`Attempting to register user with email: ${dto.email}`);

    // Перевіряємо чи email вже існує
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      this.logger.warn(`Registration failed: email ${dto.email} already exists`);
      throw new ConflictException('Користувач з таким email вже існує');
    }

    // Перевіряємо чи телефон вже існує
    const existingPhone = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (existingPhone) {
      this.logger.warn(`Registration failed: phone ${dto.phone} already exists`);
      throw new ConflictException('Користувач з таким номером телефону вже існує');
    }

    // Хешуємо пароль
    const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    // Створюємо користувача з роллю CUSTOMER (за замовчуванням)
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        name: dto.name,
        role: Role.CUSTOMER,
      },
    });

    this.logger.log(`User registered successfully: ${user.id}`);

    // Не повертаємо хеш пароля
    const { passwordHash: _, ...result } = user;
    return result;
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    this.logger.log(`Login attempt for email: ${dto.email}`);

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      this.logger.warn(`Login failed: user not found for email ${dto.email}`);
      throw new UnauthorizedException('Невірний email або пароль');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      this.logger.warn(`Login failed: invalid password for email ${dto.email}`);
      throw new UnauthorizedException('Невірний email або пароль');
    }

    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);

    this.logger.log(`User logged in successfully: ${user.id}`);

    return { access_token };
  }

  async validateUserById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        balances: {
          select: {
            merchantId: true,
            pointsAmount: true,
          },
        },
        managedMerchants: {
          select: {
            id: true,
            name: true,
            cashbackRate: true,
          },
        },
      },
    });

    if (!user) {
      this.logger.warn(`User not found: ${userId}`);
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  generateQrPayload(userId: string): { qr_payload: string } {
    this.logger.log(`Generating QR payload for user: ${userId}`);

    const payload: QrPayload = {
      user_id: userId,
      timestamp: Date.now(),
    };

    const qr_payload = this.jwtService.sign(payload, {
      expiresIn: this.QR_TOKEN_EXPIRES_IN,
    });

    return { qr_payload };
  }

  verifyQrPayload(qrPayload: string): QrPayload {
    try {
      return this.jwtService.verify<QrPayload>(qrPayload);
    } catch (error) {
      this.logger.warn(`Invalid or expired QR payload`);
      throw new UnauthorizedException('QR-код недійсний або прострочений');
    }
  }
}
