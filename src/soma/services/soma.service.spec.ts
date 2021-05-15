import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlerService } from './crawler.service';
import { Mentoring } from '../entities/mentoring.entity';
import { MentoringService } from './mentoring.service';
import { SomaService } from './soma.service';

describe('SomaService', () => {
  let service: SomaService;

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
      providers: [SomaService, CrawlerService, MentoringService],
    }).compile();

    service = module.get<SomaService>(SomaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
