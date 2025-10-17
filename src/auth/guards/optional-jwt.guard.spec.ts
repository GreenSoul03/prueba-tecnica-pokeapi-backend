import { OptionalJwtAuthGuard } from './optional-jwt.guard';

describe('OptionalJwtAuthGuard', () => {
  let guard: OptionalJwtAuthGuard;

  beforeEach(() => {
    guard = new OptionalJwtAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return user if present', () => {
    const user = { sub: 1, email: 'test@example.com' };
    const result = guard['handleRequest'](null, user);
    expect(result).toEqual(user);
  });

  it('should return undefined if user is not present', () => {
    const result = guard['handleRequest'](null, false);
    expect(result).toBeUndefined();
  });

  it('should return user with correct type', () => {
    const user = { sub: 42, email: 'user@example.com' };
    const result = guard['handleRequest'](null, user);
    expect(result?.sub).toBe(42);
    expect(result?.email).toBe('user@example.com');
  });
});
