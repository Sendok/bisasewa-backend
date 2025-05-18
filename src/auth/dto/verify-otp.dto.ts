import { IsNotEmpty, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @Length(6, 6)
  code: string;
}
