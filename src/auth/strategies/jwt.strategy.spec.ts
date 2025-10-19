import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy, JwtPayload } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeAll(() => {
    // Aseguramos que exista la variable de entorno
    process.env.JWT_SECRET = 'test-secret';
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate payload correctly', () => {
    const payload: JwtPayload = { sub: 1, email: 'test@example.com' };
    const result = strategy.validate(payload);
    expect(result).toEqual(payload);
  });

  it('should return payload with correct types', () => {
    const payload: JwtPayload = { sub: 42, email: 'user@example.com' };
    const validated = strategy.validate(payload);
    expect(typeof validated.sub).toBe('number');
    expect(typeof validated.email).toBe('string');
  });
});
