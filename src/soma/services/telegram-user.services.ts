import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TelegramUser } from '../entities/telegram-user.entity';

@Injectable()
export class TelegramUsersService {
  constructor(
    @InjectRepository(TelegramUser)
    private telegramUsersRepository: Repository<TelegramUser>,
  ) {}

  async getTelegramUser(id: number): Promise<TelegramUser> {
    return this.telegramUsersRepository.findOne(id);
  }

  async getTelegramUsers(): Promise<TelegramUser[]> {
    return this.telegramUsersRepository.find();
  }

  async getSubscribedTelegramUsers(): Promise<TelegramUser[]> {
    return this.telegramUsersRepository.find({ where: { subscribed: true } });
  }

  async create(id: number) {
    const telegramUser = await this.telegramUsersRepository.create({ id });
    return this.telegramUsersRepository.save(telegramUser);
  }

  async update(id: number, data: Partial<TelegramUser>) {
    return this.telegramUsersRepository.update(id, data);
  }
}
