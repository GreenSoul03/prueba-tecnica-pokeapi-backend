import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Endpoint de prueba para la API' })
  @ApiResponse({
    status: 200,
    description: 'Mensaje de bienvenida devuelto correctamente',
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
