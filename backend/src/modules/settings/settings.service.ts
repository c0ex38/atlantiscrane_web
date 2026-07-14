import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const settings = await this.prisma.setting.findMany();
    // Reduce array to a single key-value object
    return settings.reduce((acc: Record<string, any>, current) => {
      acc[current.key] = current.value;
      return acc;
    }, {} as Record<string, any>);
  }

  async updateBulk(settingsObject: Record<string, any>) {
    const promises = Object.entries(settingsObject).map(([key, value]) => {
      return this.prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    });

    await Promise.all(promises);
    return this.findAll();
  }
}
