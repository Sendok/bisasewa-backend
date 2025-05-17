/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { Snap } from 'midtrans-client';

@Injectable()
export class PaymentsService {
  private snap!: Snap;

  constructor() {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const clientKey = process.env.MIDTRANS_CLIENT_KEY;

    if (!serverKey || !clientKey) {
      throw new Error(
        'MIDTRANS_SERVER_KEY and MIDTRANS_CLIENT_KEY must be set',
      );
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.snap = new Snap({
        isProduction: false, // Ganti ke true untuk production
        serverKey: serverKey,
        clientKey: clientKey,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error('Failed to initialize Midtrans Snap: ' + errorMessage);
    }
  }

  async createTransaction(data: {
    orderId: string;
    grossAmount: number;
    customerName: string;
    customerEmail: string;
  }) {
    const parameter = {
      transaction_details: {
        order_id: data.orderId,
        gross_amount: data.grossAmount,
      },
      customer_details: {
        first_name: data.customerName,
        email: data.customerEmail,
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const transaction = await this.snap.createTransaction(parameter);
    if (typeof transaction === 'object' && transaction !== null) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        token: transaction.token as string,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        redirect_url: transaction.redirect_url as string,
      };
    }
    throw new Error('Invalid transaction response from Midtrans');
  }

  // Untuk webhook
  handleCallback(payload: any) {
    // Validasi signature key (opsional)
    const { order_id, transaction_status } = payload;

    // Logic update Booking + Invoice status
    if (transaction_status === 'settlement') {
      // mark as paid
      this.updateTransactionStatus(order_id, 'PAID');
    }

    return { message: 'Callback received' };
  }

  private updateTransactionStatus(orderId: string, status: string): void {
    // TODO: Implement your database update logic here
    console.log(`Updating order ${orderId} with status ${status}`);
  }
}
