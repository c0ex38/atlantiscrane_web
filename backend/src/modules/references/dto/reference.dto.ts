import { IsNotEmpty, IsString, IsObject, IsOptional, IsBoolean } from 'class-validator';

export class CreateReferenceDto {
  @IsObject()
  @IsNotEmpty()
  title: Record<string, string>;

  @IsObject()
  @IsOptional()
  client?: Record<string, string>;

  @IsObject()
  @IsOptional()
  category?: Record<string, string>;

  @IsObject()
  @IsOptional()
  description?: Record<string, string>;

  @IsString()
  @IsOptional()
  image?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateReferenceDto {
  @IsObject()
  @IsOptional()
  title?: Record<string, string>;

  @IsObject()
  @IsOptional()
  client?: Record<string, string>;

  @IsObject()
  @IsOptional()
  category?: Record<string, string>;

  @IsObject()
  @IsOptional()
  description?: Record<string, string>;

  @IsString()
  @IsOptional()
  image?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
