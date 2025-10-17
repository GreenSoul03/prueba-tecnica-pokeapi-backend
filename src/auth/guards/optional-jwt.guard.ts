import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Exportamos la interfaz para poder reutilizarla si se necesita
export interface JwtPayload {
  sub: number;
  email: string;
  // agrega otros campos si tu payload los tiene (p.ej., role, name)
}

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(err: any, user: TUser | false): TUser | undefined {
    // ✅ Forzamos a TUser | undefined
    return (user as TUser) ?? undefined;
  }
}
