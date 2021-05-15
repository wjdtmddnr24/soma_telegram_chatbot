import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService {
  private readonly bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
    polling: true,
  });

  async testBot(): Promise<TelegramBot.User> {
    return this.bot.getMe();
  }

  async sendMessage(chatId: string, text: string) {
    return this.bot.sendMessage(chatId, text);
  }
}
