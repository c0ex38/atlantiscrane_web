import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private setRefreshTokenCookie(res: Response, token: string) {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: isProduction, // Secure in production (requires HTTPS)
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/api/v1/auth', // Path-restricted as per rules
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
    });
  }

  private clearRefreshTokenCookie(res: Response) {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/api/v1/auth',
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    const tokens = await this.authService.createSession(user.id, user.email);

    this.setRefreshTokenCookie(response, tokens.refreshToken);

    return {
      success: true,
      data: {
        accessToken: tokens.accessToken,
      },
      message: 'Giriş başarılı.',
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const requestCookies = request.cookies as
      Record<string, string> | undefined;
    const refreshToken = requestCookies?.['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Oturum anahtarı bulunamadı.');
    }

    const tokens = await this.authService.refreshSession(refreshToken);
    this.setRefreshTokenCookie(response, tokens.refreshToken);

    return {
      success: true,
      data: {
        accessToken: tokens.accessToken,
      },
      message: 'Token başarıyla yenilendi.',
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const requestCookies = request.cookies as
      Record<string, string> | undefined;
    const refreshToken = requestCookies?.['refresh_token'];
    if (refreshToken) {
      await this.authService.revokeSession(refreshToken);
    }

    this.clearRefreshTokenCookie(response);

    return {
      success: true,
      message: 'Oturum sonlandırıldı.',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() request: Request) {
    const requestWithUser = request as Request & {
      user: { sub: string; email: string };
    };
    const userId = requestWithUser.user.sub;
    const user = await this.authService.getUserById(userId);

    return {
      success: true,
      data: user,
    };
  }
}
