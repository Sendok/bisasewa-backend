import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';

// Jika nanti butuh BookingService atau InvoiceService, bisa tambahkan di imports
@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService], // agar service ini bisa digunakan di modul lain seperti Bookings
})
export class PaymentsModule {}
