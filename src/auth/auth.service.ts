import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

const hashPassword = async (
  password: string,
  saltRounds = 10,
): Promise<string> => {
  return bcrypt.hash(password, saltRounds);
};

const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

@Injectable()
export class AuthService {
  constructor(
    @Inject('PRISMA_CLIENT') private prisma: PrismaClient,
    private jwtService: JwtService,
  ) {}

  async register(
    dto: RegisterDto,
  ): Promise<{ message: string; userId: number }> {
    const exists: User | null = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) throw new UnauthorizedException('El correo ya está registrado');

    let hashedPassword: string;
    try {
      hashedPassword = await hashPassword(dto.password);
    } catch {
      throw new UnauthorizedException('Error al encriptar la contraseña');
    }

    const user: User = await this.prisma.user.create({
      data: {
        name: dto.name || 'User',
        email: dto.email,
        password: hashedPassword,
      },
    });

    return { message: 'Usuario creado correctamente', userId: user.id };
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    let isValid = false;
    try {
      isValid = await comparePassword(dto.password, user.password);
    } catch {
      throw new UnauthorizedException('Error al verificar la contraseña');
    }

    if (!isValid) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: user.id, email: user.email };
    const token: string = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
