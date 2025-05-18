import { IsNotEmpty } from 'class-validator';

export class RequestOtpDto {
  @IsNotEmpty()
  phone: string;
}
