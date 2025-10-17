import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call AuthService.register and return the result', async () => {
      const dto: RegisterDto = {
        name: 'User',
        email: 'test@example.com',
        password: '1234',
      };
      const mockResult = { message: 'Usuario creado correctamente', userId: 1 };
      mockAuthService.register.mockResolvedValue(mockResult);

      const result = await controller.register(dto);
      expect(result).toEqual(mockResult);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should call AuthService.login and return the token', async () => {
      const dto: LoginDto = { email: 'test@example.com', password: '1234' };
      const mockResult = { access_token: 'jwt-token' };
      mockAuthService.login.mockResolvedValue(mockResult);

      const result = await controller.login(dto);
      expect(result).toEqual(mockResult);
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });
  });
});
