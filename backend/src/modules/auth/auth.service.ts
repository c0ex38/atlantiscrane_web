import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import type { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('E-posta adresi veya şifre hatalı.');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Kullanıcı hesabı aktif değil.');
    }

    const isPasswordMatching = await argon2.verify(user.passwordHash, pass);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('E-posta adresi veya şifre hatalı.');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const result = { ...user };
    delete (result as Partial<typeof user>).passwordHash;
    return result;
  }

  async createSession(
    userId: string,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessSecret =
      this.configService.get<string>('JWT_ACCESS_SECRET') ||
      'atlantis_access_secret';
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      'atlantis_refresh_secret';
    const accessExpiresIn =
      this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '30m';
    const refreshExpiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '30d';

    // 1. Create a session record first with placeholder to get uuid
    const session = await this.prisma.authSession.create({
      data: {
        userId,
        refreshTokenHash: `temp-${crypto.randomBytes(16).toString('hex')}`,
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
      },
    });

    // 2. Generate tokens
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, email },
      { secret: accessSecret, expiresIn: accessExpiresIn as any },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId, sessionId: session.id },
      { secret: refreshSecret, expiresIn: refreshExpiresIn as any },
    );
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */

    // 3. Update the session with the real hash
    const refreshTokenHash = this.hashToken(refreshToken);
    await this.prisma.authSession.update({
      where: { id: session.id },
      data: { refreshTokenHash },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshSession(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      'atlantis_refresh_secret';

    let payload: { sub: string; sessionId: string };
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: refreshSecret,
      });
    } catch {
      throw new UnauthorizedException(
        'Geçersiz veya süresi dolmuş refresh token.',
      );
    }

    const hashedToken = this.hashToken(refreshToken);

    const session = await this.prisma.authSession.findUnique({
      where: { refreshTokenHash: hashedToken },
      include: { user: true },
    });

    if (!session) {
      throw new UnauthorizedException('Oturum bulunamadı.');
    }

    if (payload.sub !== session.userId || payload.sessionId !== session.id) {
      throw new UnauthorizedException('Geçersiz oturum bilgisi.');
    }

    if (session.revokedAt) {
      throw new UnauthorizedException('Bu oturum sonlandırılmış.');
    }

    if (new Date() > session.expiresAt) {
      throw new UnauthorizedException('Oturum süresi dolmuş.');
    }

    if (!session.user.isActive) {
      throw new ForbiddenException('Kullanıcı hesabı aktif değil.');
    }

    // Refresh Token Rotation: Revoke the old session
    await this.prisma.authSession.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });

    // Create a brand new session
    return this.createSession(session.user.id, session.user.email);
  }

  async revokeSession(refreshToken: string) {
    const hashedToken = this.hashToken(refreshToken);

    // Revoke the session in database (or delete it to clean up)
    try {
      await this.prisma.authSession.updateMany({
        where: { refreshTokenHash: hashedToken },
        data: { revokedAt: new Date() },
      });
    } catch {
      // Ignore if session not found
    }
  }

  async getUserById(userId: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Kullanıcı bulunamadı veya pasif.');
    }
    const result = { ...user };
    delete (result as Partial<typeof user>).passwordHash;
    return result;
  }
}
