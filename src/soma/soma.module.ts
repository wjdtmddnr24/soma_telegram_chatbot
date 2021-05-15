import { Module } from '@nestjs/common';
import { SomaService } from './soma.service';
import { CrawlerService } from './crawler.service';
import { MentoringService } from './mentoring.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mentoring } from './mentoring.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mentoring])],
  providers: [SomaService, MentoringService, CrawlerService],
})
export class SomaModule {}
