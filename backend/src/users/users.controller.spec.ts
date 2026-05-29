import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            searchUsers: jest.fn(),
            makeUserMerchant: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('searchUsers', () => {
    it('should throw BadRequestException if phone or merchantId is missing', async () => {
      await expect(controller.searchUsers('', 'merchant-123')).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.searchUsers('50123', '')).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.searchUsers('', '')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should call usersService.searchUsers and return results', async () => {
      const mockResult = [{ id: '1', name: 'Ivan', phone: '+38050***4567' }];
      jest.spyOn(service, 'searchUsers').mockResolvedValue(mockResult);

      const result = await controller.searchUsers('50123', 'merchant-123');

      expect(service.searchUsers).toHaveBeenCalledWith('50123', 'merchant-123');
      expect(result).toEqual(mockResult);
    });

    it('should return empty array if no users found', async () => {
      jest.spyOn(service, 'searchUsers').mockResolvedValue([]);

      const result = await controller.searchUsers('99999', 'merchant-123');

      expect(service.searchUsers).toHaveBeenCalledWith('99999', 'merchant-123');
      expect(result).toEqual([]);
    });
  });

  describe('makeMeMerchant', () => {
    it('should call usersService.makeUserMerchant with user ID from request', async () => {
      const req = { user: { id: 'user-123' } };
      const mockResponse = { success: true, message: 'Тепер ви мерчант!' };
      jest.spyOn(service, 'makeUserMerchant').mockResolvedValue(mockResponse);

      const result = await controller.makeMeMerchant(req);

      expect(service.makeUserMerchant).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(mockResponse);
    });
  });
});
