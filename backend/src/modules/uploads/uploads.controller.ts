import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname, join } from 'path';
import * as crypto from 'crypto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as fs from 'fs';
import sharp from 'sharp';

@Controller('upload')
export class UploadsController {
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB max for videos/images
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Dosya yüklenemedi.');
    }

    const uploadPath = './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const isImage = file.mimetype.startsWith('image/') && !file.mimetype.includes('svg');

    let filename = '';

    try {
      if (isImage) {
        // Optimize image with sharp
        filename = `${uniqueSuffix}.webp`;
        const filePath = join(uploadPath, filename);
        
        await sharp(file.buffer)
          .resize({ width: 1920, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(filePath);
      } else {
        // Save as is (e.g. video, svg, pdf)
        const ext = extname(file.originalname);
        filename = `${uniqueSuffix}${ext}`;
        const filePath = join(uploadPath, filename);
        await fs.promises.writeFile(filePath, file.buffer);
      }
    } catch (err) {
      console.error('File optimization/save error:', err);
      throw new BadRequestException('Dosya işlenirken bir hata oluştu.');
    }
    
    return {
      success: true,
      url: `/uploads/${filename}`,
    };
  }
}
