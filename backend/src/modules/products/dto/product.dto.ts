import { IsNotEmpty, IsString, IsObject, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsObject()
  @IsNotEmpty()
  title: Record<string, string>;

  @IsObject()
  @IsOptional()
  shortIntro?: Record<string, string>;

  @IsObject()
  @IsOptional()
  description?: Record<string, string>;

  @IsObject()
  @IsOptional()
  usage?: Record<string, string>;

  @IsObject()
  @IsOptional()
  capacity?: Record<string, string>;

  @IsObject()
  @IsOptional()
  outreach?: Record<string, string>;

  @IsObject()
  @IsOptional()
  features?: Record<string, string[]>;

  @IsArray()
  @IsOptional()
  loadChart?: { outreach: string; capacity: string }[];

  @IsObject()
  @IsOptional()
  specs?: Record<string, Record<string, string>>;

  @IsObject()
  @IsOptional()
  equipments?: { standard: string[]; optional: string[] };

  @IsString()
  @IsOptional()
  image?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  showOnHome?: boolean;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  slug?: string;

  @IsObject()
  @IsOptional()
  title?: Record<string, string>;

  @IsObject()
  @IsOptional()
  shortIntro?: Record<string, string>;

  @IsObject()
  @IsOptional()
  description?: Record<string, string>;

  @IsObject()
  @IsOptional()
  usage?: Record<string, string>;

  @IsObject()
  @IsOptional()
  capacity?: Record<string, string>;

  @IsObject()
  @IsOptional()
  outreach?: Record<string, string>;

  @IsObject()
  @IsOptional()
  features?: Record<string, string[]>;

  @IsArray()
  @IsOptional()
  loadChart?: { outreach: string; capacity: string }[];

  @IsObject()
  @IsOptional()
  specs?: Record<string, Record<string, string>>;

  @IsObject()
  @IsOptional()
  equipments?: { standard: string[]; optional: string[] };

  @IsString()
  @IsOptional()
  image?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  showOnHome?: boolean;
}
