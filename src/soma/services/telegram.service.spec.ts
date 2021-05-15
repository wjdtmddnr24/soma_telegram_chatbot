import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlerService } from './crawler.service';
import { Mentoring } from '../entities/mentoring.entity';
import { MentoringService } from './mentoring.service';
import { TelegramService } from './telegram.service';

describe('TelegramService', () => {
  let service: TelegramService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'database.db',
          synchronize: true,
          logging: false,
          autoLoadEntities: true,
        }),
        TypeOrmModule.forFeature([Mentoring]),
        EventEmitterModule.forRoot(),
      ],
      providers: [TelegramService, CrawlerService, MentoringService],
    }).compile();

    service = module.get<TelegramService>(TelegramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should testBot', async () => {
    const ret = await service.testBot();
    console.log(ret);
    expect(ret).not.toBeNull();
  });
});
