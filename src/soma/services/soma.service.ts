import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Message } from 'node-telegram-bot-api';
import { IMentoring } from 'src/common/interfaces/soma.interface';
import { CrawlerService } from './crawler.service';
import { TelegramUsersService } from './telegram-user.services';
import { TelegramService } from './telegram.service';
@Injectable()
export class SomaService {
  private readonly logger = new Logger(SomaService.name);

  constructor(
    private readonly telegramUsersService: TelegramUsersService,
    private readonly telegramService: TelegramService,
  ) {}

  @OnEvent('new_mentoring', { async: true })
  async handleNewMentoring(mentoring: IMentoring): Promise<void> {
    this.logger.log(`New Mentoring #${mentoring.id}`);

    const telegramUsers =
      await this.telegramUsersService.getSubscribedTelegramUsers();
    for (const telegramUser of telegramUsers) {
      await this.telegramService.sendMessage(
        telegramUser.id,
        `<b>${mentoring.title}</b>\n\n멘토: ${mentoring.writer}\n장소: ${
          mentoring.mentoringLocation
        }\n특강일: ${mentoring.mentoringDate.getFullYear()}-${
          mentoring.mentoringDate.getMonth() + 1
        }-${mentoring.mentoringDate.getDate()}\n\nhttps://www.swmaestro.org/sw/mypage/mentoLec/view.do?qustnrSn=${
          mentoring.id
        }&menuNo=200046`,
        { parse_mode: 'HTML' },
      );
    }
  }

  @OnEvent('telegram.subscribe')
  async subscribeMentoring(msg: Message) {
    const chatId = msg.chat.id;
    this.logger.log(`User #${chatId} Subscribed`);
    const telegramUser = await this.telegramUsersService.getTelegramUser(
      chatId,
    );
    if (telegramUser) {
      await this.telegramUsersService.update(chatId, {
        ...telegramUser,
        subscribed: true,
      });
    } else {
      await this.telegramUsersService.create(chatId);
    }
    return this.telegramService.sendMessage(chatId, 'Subscribed!');
  }

  @OnEvent('telegram.unsubscribe')
  async unSubscribeMentoring(msg: Message) {
    const chatId = msg.chat.id;
    this.logger.log(`User #${chatId} Unsubscribed`);
    const telegramUser = await this.telegramUsersService.getTelegramUser(
      chatId,
    );
    if (telegramUser) {
      await this.telegramUsersService.update(chatId, {
        ...telegramUser,
        subscribed: false,
      });
      return this.telegramService.sendMessage(chatId, 'UnSubscribed!');
    }
  }
}
