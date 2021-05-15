import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlerService } from './crawler.service';
import { Mentoring } from './mentoring.entity';
import { MentoringService } from './mentoring.service';

describe('CrawlerService', () => {
  let service: CrawlerService;

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
      ],
      providers: [MentoringService, CrawlerService],
    }).compile();

    service = module.get<CrawlerService>(CrawlerService);
    await service.initialize();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return mentorings', async () => {
    const res = await service.fetchMentorings();
    expect(res.length).toEqual(10);
  });

  it('should return second page mentoring', async () => {
    const res = await service.fetchMentorings(2);
    expect(res[0].id).toBeGreaterThan(635);
  });

  it('should return empty mentorings', async () => {
    const res = await service.fetchMentorings(100);
    expect(res.length).toEqual(0);
  });

  it('should fetch Mentoring Detail', async () => {
    const res = await service.fetchMentoringDetails(643);
    expect(res.mentoringLocation).toEqual('소마센터 6층 6회의실');
  });
});
