import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IMentoring } from 'src/common/interfaces/soma.interface';
import { Mentoring } from './mentoring.entity';
import { MentoringService } from './mentoring.service';

describe('MentoringService', () => {
  let service: MentoringService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'database.db',
          synchronize: true,
          logging: false,
          autoLoadEntities: true,
        }),
        TypeOrmModule.forFeature([Mentoring]),
      ],
      providers: [MentoringService],
    }).compile();

    service = module.get<MentoringService>(MentoringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should create', async () => {
  //   const mentoring: IMentoring = {
  //     id: 0,
  //     appliedCnt: 0,
  //     applyEndDate: new Date(),
  //     applyStartDate: new Date(),
  //     createdAt: new Date(),
  //     mentoringDate: new Date(),
  //     state: '',
  //     title: '',
  //     writer: '',
  //     content: '',
  //     mentoringLocation: '',
  //   };
  //   const res = await service.create(mentoring);
  //   console.log(res);
  //   expect(res.id).toEqual(0);
  // });
  it('should getMentoringById', async () => {
    const mentoring = await service.getMentoringById(0);
    console.log(mentoring);
    expect(mentoring.id).toEqual(0);
  });
  it('should getMostRecentMentoring', async () => {
    const mentoring = await service.getMostRecentMentoring();
    expect(mentoring.id).toEqual(0);
  });
  it('should getMentorings', async () => {
    const mentorings = await service.getMentorings();
    expect(mentorings.length).toBeGreaterThanOrEqual(0);
  });
});
