import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService {
  private readonly bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
    polling: true,
  });

  constructor(private eventEmitter: EventEmitter2) {
    this.bot.onText(/\/subscribe/, (msg) =>
      eventEmitter.emit('telegram.subscribe', msg),
    );

    this.bot.onText(/\/unsubscribe/, (msg) =>
      eventEmitter.emit('telegram.unsubscribe', msg),
    );
  }

  async testBot(): Promise<TelegramBot.User> {
    return this.bot.getMe();
  }

  async sendMessage(chatId: number, text: string) {
    return this.bot.sendMessage(chatId, text);
  }
}
