import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(err: any, user: TUser | false): TUser | undefined {
    return (user as TUser) || undefined;
  }
}
