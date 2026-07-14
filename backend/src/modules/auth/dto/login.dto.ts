import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi girin.' })
  @IsNotEmpty({ message: 'E-posta alanı boş bırakılamaz.' })
  email: string;

  @MinLength(10, { message: 'Parola en az 10 karakter olmalıdır.' })
  @IsNotEmpty({ message: 'Parola alanı boş bırakılamaz.' })
  password: string;
}
