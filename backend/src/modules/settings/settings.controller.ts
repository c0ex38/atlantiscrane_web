import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async findAll() {
    const settings = await this.settingsService.findAll();
    return { data: settings };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async updateBulk(@Body() updateSettingsDto: UpdateSettingsDto) {
    const settings = await this.settingsService.updateBulk(updateSettingsDto.settings);
    return {
      message: 'Ayarlar başarıyla güncellendi.',
      data: settings,
    };
  }
}
