import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Correo electrónico del usuario', example: 'admin@example.com' })
  @IsEmail({}, { message: 'Debe ser un correo válido' })
  email: string;

  @ApiProperty({ description: 'Contraseña del usuario', example: 'kitkaton123' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;
}
