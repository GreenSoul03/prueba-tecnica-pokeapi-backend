import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy, JwtPayload } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule],
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
});
