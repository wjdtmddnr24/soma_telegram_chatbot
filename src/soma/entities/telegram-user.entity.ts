import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class TelegramUser {
  @PrimaryColumn()
  id: number;
  @Column({ default: true })
  subscribed: boolean;
}
