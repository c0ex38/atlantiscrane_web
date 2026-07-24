import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';

@Injectable()
export class EnquiriesService {
  constructor(private prisma: PrismaService) {}

  async create(createEnquiryDto: CreateEnquiryDto) {
    return this.prisma.enquiry.create({
      data: createEnquiryDto,
    });
  }

  async findAll() {
    return this.prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRecent(take: number = 5) {
    return this.prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take,
    });
  }

  async markAsRead(id: string) {
    return this.prisma.enquiry.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async remove(id: string) {
    return this.prisma.enquiry.delete({
      where: { id },
    });
  }
}
