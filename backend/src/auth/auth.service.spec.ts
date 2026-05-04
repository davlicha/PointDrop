import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockUser = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'test@example.com',
    phone: '+380961234567',
    name: 'Test User',
    passwordHash: 'hashedPassword123',
    role: 'CUSTOMER' as const,
    createdAt: new Date(),
  };

  const mockJwtToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJyb2xlIjoiQ1VTVE9NRVIifQ.test';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue(mockJwtToken),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
        phone: '+380501234567',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue({
        ...mockUser,
        email: registerDto.email,
        phone: registerDto.phone,
      } as any);

      const result = await service.register(registerDto);

      expect(result.email).toBe(registerDto.email);
      expect(prismaService.user.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      const registerDto = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
        phone: '+380501234567',
      };

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockUser as any);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException if phone already exists', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
        phone: '+380961234567',
      };

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockUser as any);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        phone: mockUser.phone,
        role: mockUser.role,
        createdAt: mockUser.createdAt,
      } as any);

      const result = await service.getUserProfile(mockUser.id);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('email');
    });
  });

  describe('validateUserById', () => {
    it('should return user if found', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockUser as any);

      const result = await service.validateUserById(mockUser.id);

      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await service.validateUserById('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('generateQrPayload', () => {
    it('should generate QR payload with JWT token', () => {
      const result = service.generateQrPayload(mockUser.id);

      expect(result).toHaveProperty('qr_payload');
      expect(typeof result.qr_payload).toBe('string');
    });
  });

  describe('verifyQrPayload', () => {
    it('should verify valid QR payload', () => {
      const payload = { user_id: mockUser.id, timestamp: Date.now() };
      jest.spyOn(jwtService, 'verify').mockReturnValue(payload as any);

      const result = service.verifyQrPayload(mockJwtToken);

      expect(result).toEqual(payload);
    });

    it('should throw UnauthorizedException if QR payload is invalid', () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => service.verifyQrPayload('invalidToken')).toThrow(
        UnauthorizedException,
      );
    });
  });
});
