import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration, { validationSchema } from './config/configuration';
import { winstonConfig } from './config/winston.config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoursesModule } from './modules/courses/courses.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AnalysisModule } from './modules/analysis/analysis.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { CartModule } from './modules/cart/cart.module';
import { ChatModule } from './modules/chat/chat.module';
import { DiscountModule } from './modules/discount/discount.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { LevelModule } from './modules/level/level.module';
import { MaterialModule } from './modules/material/material.module';
import { OtpModule } from './modules/otp/otp.module';
import { DatabaseModule } from './modules/database/database.module';
import { HealthModule } from './modules/health/health.module';
// import { EmailModule } from './modules/email/email.module';

import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: validationSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('app.database.uri'),
      }),
      inject: [ConfigService],
    }),
    WinstonModule.forRoot(winstonConfig),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
    UsersModule,
    AuthModule,
    CoursesModule,
    OrganizationsModule,
    PaymentsModule,
    AnalysisModule,
    AttendanceModule,
    CartModule,
    ChatModule,
    DiscountModule,
    // The previous DiscountModule was duplicated, removing it.
    InvoiceModule,
    LevelModule,
    MaterialModule,
    OtpModule,
    DatabaseModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
