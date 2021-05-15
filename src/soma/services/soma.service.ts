import { Injectable, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IMentoring } from 'src/common/interfaces/soma.interface';
import { CrawlerService } from './crawler.service';
import { TelegramUsersService } from './telegram-user.services';
import { TelegramService } from './telegram.service';
@Injectable()
export class SomaService {
  constructor(
    private readonly telegramUsersService: TelegramUsersService,
    private readonly telegramService: TelegramService,
  ) {}

  @OnEvent('new_mentoring', { async: true })
  async handleNewMentoring(mentoring: IMentoring): Promise<void> {
    const telegramUsers =
      await this.telegramUsersService.getSubscribedTelegramUsers();
    for (const telegramUser of telegramUsers) {
      await this.telegramService.sendMessage(telegramUser.id, mentoring.title);
    }
  }
}
