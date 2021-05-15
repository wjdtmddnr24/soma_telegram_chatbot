import { Module } from '@nestjs/common';
import { SomaService } from './soma.service';
import { CrawlerService } from './crawler.service';
import { MentoringService } from './mentoring.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mentoring } from './entities/mentoring.entity';
import { TelegramService } from './telegram.service';
import { TelegramUser } from './entities/telegram-user.entity';
import { TelegramUsersService } from './telegram-user.services';

@Module({
  imports: [TypeOrmModule.forFeature([Mentoring, TelegramUser])],
  providers: [
    SomaService,
    MentoringService,
    CrawlerService,
    TelegramService,
    TelegramUsersService,
  ],
})
export class SomaModule {}
