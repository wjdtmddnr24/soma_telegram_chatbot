import { Module } from '@nestjs/common';
import { SomaService } from './services/soma.service';
import { CrawlerService } from './services/crawler.service';
import { MentoringService } from './services/mentoring.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mentoring } from './entities/mentoring.entity';
import { TelegramService } from './services/telegram.service';
import { TelegramUser } from './entities/telegram-user.entity';
import { TelegramUsersService } from './services/telegram-user.services';

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
