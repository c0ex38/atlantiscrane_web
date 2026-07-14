import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReferencesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.reference.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.ReferenceCreateInput) {
    return this.prisma.reference.create({
      data,
    });
  }

  async update(id: string, data: Prisma.ReferenceUpdateInput) {
    await this.findOne(id);
    return this.prisma.reference.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.reference.delete({
      where: { id },
    });
  }

  private async findOne(id: string) {
    const reference = await this.prisma.reference.findUnique({
      where: { id },
    });
    if (!reference) {
      throw new NotFoundException(`Reference with ID ${id} not found`);
    }
    return reference;
  }
}
