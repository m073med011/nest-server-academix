import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OtpService } from '../otp/otp.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockOtpService = {
    createOtp: jest.fn(),
    verifyOtp: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: OtpService, useValue: mockOtpService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if password matches', async () => {
      const user = {
        email: 'test@example.com',
        password: 'hashedPassword',
        toObject: jest.fn().mockReturnValue({ email: 'test@example.com' }),
        matchPassword: jest.fn().mockResolvedValue(true),
      };
      mockUsersService.findByEmail.mockResolvedValue(user);

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual({ email: 'test@example.com' });
    });

    it('should return null if password does not match', async () => {
      const user = {
        email: 'test@example.com',
        password: 'hashedPassword',
        matchPassword: jest.fn().mockResolvedValue(false),
      };
      mockUsersService.findByEmail.mockResolvedValue(user);

      const result = await service.validateUser(
        'test@example.com',
        'wrongPassword',
      );
      expect(result).toBeNull();
    });

    it('should return null if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const user = {
        _id: 'userId',
        email: 'test@example.com',
        role: 'user',
        toObject: jest.fn().mockReturnValue({ _id: 'userId' }),
        matchPassword: jest.fn().mockResolvedValue(true),
      };

      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      mockUsersService.findByEmail.mockResolvedValue(user);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      mockJwtService.sign.mockReturnValue('token');

      const result = await service.login(loginDto, mockResponse);

      expect(result).toHaveProperty('token', 'token');
      expect(mockResponse.cookie).toHaveBeenCalled();
    });
  });
});
