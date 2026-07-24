import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { EnquiriesService } from './enquiries.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Post()
  async create(@Body() createEnquiryDto: CreateEnquiryDto) {
    const data = await this.enquiriesService.create(createEnquiryDto);
    return { success: true, data };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const data = await this.enquiriesService.findAll();
    return { data };
  }

  @Get('recent')
  @UseGuards(JwtAuthGuard)
  async getRecent() {
    const data = await this.enquiriesService.getRecent(5);
    return { data };
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  async markAsRead(@Param('id') id: string) {
    const data = await this.enquiriesService.markAsRead(id);
    return { success: true, data };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    const data = await this.enquiriesService.remove(id);
    return { success: true, data };
  }
}
