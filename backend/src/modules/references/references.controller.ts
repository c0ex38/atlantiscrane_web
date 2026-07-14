import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReferencesService } from './references.service';
import { CreateReferenceDto, UpdateReferenceDto } from './dto/reference.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('references')
export class ReferencesController {
  constructor(private readonly referencesService: ReferencesService) {}

  @Get()
  async findAll() {
    const references = await this.referencesService.findAll();
    return { data: references };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createReferenceDto: CreateReferenceDto) {
    const reference = await this.referencesService.create(createReferenceDto as any);
    return {
      message: 'Referans başarıyla oluşturuldu.',
      data: reference,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateReferenceDto: UpdateReferenceDto,
  ) {
    const reference = await this.referencesService.update(id, updateReferenceDto as any);
    return {
      message: 'Referans başarıyla güncellendi.',
      data: reference,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    await this.referencesService.remove(id);
    return {
      message: 'Referans başarıyla silindi.',
    };
  }
}
