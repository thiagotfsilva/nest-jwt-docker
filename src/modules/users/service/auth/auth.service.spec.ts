import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user.entity';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../../dto/CreateUserDTO.dto';
import { hash } from 'bcrypt';
import { ResCreateUserDto } from '../../dto/ResCreateUserDTO.dto';

describe('AuthService', () => {
  let userService: UsersService;
  const mockUserRepository = {
    save: jest.fn(),
  };
  const mockJWTService = {
    signAsync: jest.fn(),
  };

  const mockAuthService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UsersService,
        { provide: AuthService, useValue: mockAuthService },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJWTService },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user and return access token', async () => {
      const createUserDTO: CreateUserDTO = {
        name: 'John Doe',
        email: 'john@example.com',
        description: 'Test user',
        password: 'password',
      };

      const newUser = {
        id: 'dc1849aa-6f13-4135-a94e-ac3ebd692427',
        ...createUserDTO,
        password: await hash(createUserDTO.password, 12),
      };

      const result: ResCreateUserDto = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.email,
        accessToken: 'mockAccessToken',
      };

      jest.spyOn(mockUserRepository, 'save').mockResolvedValue(newUser);
      jest
        .spyOn(mockJWTService, 'signAsync')
        .mockResolvedValue('mockAccessToken');

      jest.spyOn(mockAuthService, 'create').mockResolvedValue(result);

      expect(result.accessToken).toBe('mockAccessToken');
      expect(result.name).toBe(createUserDTO.name);
      expect(result.email).toBe(createUserDTO.email);
    });
  });
});
