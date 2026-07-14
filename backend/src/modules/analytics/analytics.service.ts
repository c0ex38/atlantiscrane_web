import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async recordVisit(ip: string, userAgent: string, path: string) {
    const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent);
    
    return this.prisma.visit.create({
      data: {
        ip: ip || 'unknown',
        userAgent: userAgent || 'unknown',
        isMobile,
        path: path || '/',
      },
    });
  }

  async getStats() {
    const totalVisits = await this.prisma.visit.count();
    const mobileVisits = await this.prisma.visit.count({
      where: { isMobile: true },
    });
    const desktopVisits = totalVisits - mobileVisits;

    const recentVisits = await this.prisma.visit.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Generate chart data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const visits = await this.prisma.visit.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true }
    });

    // Group visits by date (YYYY-MM-DD)
    const grouped = visits.reduce((acc, visit) => {
      const dateStr = visit.createdAt.toISOString().split('T')[0];
      acc[dateStr] = (acc[dateStr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Create an array for the last 30 days filled with 0s if no visits
    const chartData = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      // Format as "DD Ayy" (e.g. 14 Tem)
      const formatted = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
      chartData.push({
        date: formatted,
        visits: grouped[dateStr] || 0
      });
    }

    return {
      total: totalVisits,
      mobile: mobileVisits,
      desktop: desktopVisits,
      recent: recentVisits,
      chartData
    };
  }
}
