import { Test, TestingModule } from '@nestjs/testing';
import { TelegramUsersService } from './telegram-user.services';

describe('TelegramUserService', () => {
  let service: TelegramUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelegramUsersService],
    }).compile();

    service = module.get<TelegramUsersService>(TelegramUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
