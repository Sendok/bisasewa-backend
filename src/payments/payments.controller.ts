import { Controller, Post, Body, Headers } from '@nestjs/common';
import { PaymentsService } from './payments.service';

interface CreatePaymentDto {
  orderId: string;
  amount: number;
  name: string;
  email: string;
}

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create')
  async create(@Body() body: CreatePaymentDto) {
    const result = await this.paymentsService.createTransaction({
      orderId: body.orderId,
      grossAmount: body.amount,
      customerName: body.name,
      customerEmail: body.email,
    });

    return result;
  }

  @Post('webhook')
  async handleWebhook(@Body() payload: any) {
    return this.paymentsService.handleCallback(payload);
  }
}
