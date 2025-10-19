import { JwtAuthGuard } from './jwt-auth.guard';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return user if present', () => {
    const user = { sub: 1, email: 'test@example.com' };
    const result = guard['handleRequest'](null, user);
    expect(result).toEqual(user);
  });

  it('should throw UnauthorizedException if user is not present', () => {
    expect(() => guard['handleRequest'](null, false)).toThrow(
      UnauthorizedException,
    );
  });

  it('should throw provided error if err is present', () => {
    const error = new Error('Some error');
    expect(() => guard['handleRequest'](error, null)).toThrow(error);
  });

  it('should return user with correct type', () => {
    const user = { sub: 42, email: 'user@example.com' };
    const result = guard['handleRequest'](null, user);
    expect(result?.sub).toBe(42);
    expect(result?.email).toBe('user@example.com');
  });
});
