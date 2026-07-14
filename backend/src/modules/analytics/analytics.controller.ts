import { Controller, Post, Get, Req, Body, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request } from 'express';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('visit')
  async recordVisit(
    @Req() req: Request,
    @Body() body: { path: string }
  ) {
    // Get IP address (handling proxies if any)
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || req.ip;
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    const ipString = typeof ip === 'string' ? ip : (Array.isArray(ip) ? ip[0] : 'unknown');
    
    await this.analyticsService.recordVisit(ipString || 'unknown', userAgent, body.path);
    
    return { success: true };
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats() {
    const stats = await this.analyticsService.getStats();
    return { data: stats };
  }
}
