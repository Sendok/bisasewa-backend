// app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { UsersModule } from './users/users.module';
import { ListingsModule } from './listings/listings.module';
import { CategoryModule } from './categories/categories.module';
import { BookingsModule } from './bookings/bookings.module';
import { AuthModule } from './auth/auth.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        uri: process.env.MONGODB_URI,
      }),
    }),
    UsersModule,
    ListingsModule,
    CategoryModule,
    BookingsModule,
    AuthModule,
    PaymentsModule,
    // ...modules like AuthModule, UsersModule, etc.
  ],
})
export class AppModule {}
