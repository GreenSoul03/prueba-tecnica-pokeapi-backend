import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Autenticación')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({
    type: RegisterDto,
    examples: {
      default: {
        value: {
          name: 'Mauricio Lombardo',
          email: 'mauricio@example.com',
          password: 'kitkaton123',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado correctamente',
    schema: { example: { message: 'Usuario creado correctamente', userId: 1 } },
  })
  @ApiResponse({ status: 400, description: 'Error en los datos de registro' })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Login de usuario y obtención de JWT' })
  @ApiBody({
    type: LoginDto,
    examples: {
      default: {
        value: { email: 'mauricio@example.com', password: 'kitkaton123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso con token JWT',
    schema: { example: { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI...' } },
  })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
