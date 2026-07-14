import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Erişim anahtarı bulunamadı.');
    }

    try {
      const accessSecret =
        this.configService.get<string>('JWT_ACCESS_SECRET') ||
        'atlantis_access_secret';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = await this.jwtService.verifyAsync(token, {
        secret: accessSecret,
      });

      interface RequestWithUser extends Request {
        user?: Record<string, unknown>;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      (request as RequestWithUser).user = payload;
    } catch {
      throw new UnauthorizedException(
        'Erişim anahtarı geçersiz veya süresi dolmuş.',
      );
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
