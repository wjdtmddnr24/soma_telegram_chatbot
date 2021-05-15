import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SomaModule } from './soma/soma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        USERNAME: Joi.string().required(),
        PASSWORD: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.db',
      synchronize: true,
      logging: false,
      autoLoadEntities: true,
    }),
    SomaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
