import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user.entity';
import { BadRequestException } from '@nestjs/common';
import { UpdateUserDTO } from '../../dto/UpdateUserDTO.dto';

describe('UsersService', () => {
  let userService: UsersService;
  const mockUserRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findUser', () => {
    it('should find user', async () => {
      const user = {
        id: 'f42749b6-8082-4131-9992-234cfcf734cc',
        name: 'Samuel Leandro',
        email: 'samuelll@email.com',
        description: 'um novo usuario novo',
        password:
          '$2b$12$JiCerrWfBa2UZRZfXv/MDublXPhlHFWVuygg2Hu7F2TPJjKDDDDvC',
        createdAt: '2024-04-06T15:00:50.985Z',
        updatedAt: '2024-04-06T15:00:50.985Z',
      };

      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(user);
      const result = await userService.findUser(user.id);

      expect(result.name).toBe(user.name);
      expect(result.email).toBe(user.email);
      expect(result.description).toBe(user.description);
    });

    it('should throw BadRequestException when user is not found', async () => {
      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(null);

      await expect(userService.findUser('1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update user information', async () => {
      const updateUserDTO: UpdateUserDTO = {
        name: 'Jane Doe',
        description: 'Updated user',
      };
      const mockUser = {
        id: 'f42749b6-8082-4131-9992-234cfcf734cc',
        name: 'John Doe',
        email: 'john@example.com',
        description: 'Test user',
        password: 'password',
        createdAt: '2022-04-05',
        updatedAt: '2022-04-05',
      };
      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(mockUserRepository, 'save').mockResolvedValue(mockUser);

      await userService.updateUser(
        updateUserDTO,
        'f42749b6-8082-4131-9992-234cfcf734cc',
      );
      expect(mockUser.name).toBe(updateUserDTO.name);
      expect(mockUser.description).toBe(updateUserDTO.description);
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const userId = 'f42749b6-8082-4131-9992-234cfcf734cc';
      jest.spyOn(userService, 'findUser').mockResolvedValueOnce(null);
      jest
        .spyOn(mockUserRepository, 'delete')
        .mockResolvedValueOnce({ affected: 1 });

      await userService.deleteUser(userId);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
    });

    it('should throw BadRequestException when user is not found', async () => {
      const userId = 'f42749b6-8082-4131-9992-234cfcf734cc';
      jest
        .spyOn(userService, 'findUser')
        .mockRejectedValueOnce(new BadRequestException());

      await expect(userService.deleteUser(userId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
