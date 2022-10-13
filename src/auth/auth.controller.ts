import { Controller, Get } from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/auth/login')
  async login(@Query('idtoken') idtoken: string) {
    return await this.authService.login(idtoken);
  }
}
