import { Controller, Get } from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/login')
  async login(@Query('idtoken') idtoken: string) {
    // idtoken for LINE and send to for claim custom token
    return await this.authService.login(idtoken);
  }

  @Get('/session')
  async getSession(@Query('idtoken') idtoken: string) {
    // idtoken for LINE and send to for claim custom token

    return await this.authService.getSession(idtoken);
  }
}
