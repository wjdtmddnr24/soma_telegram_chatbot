import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class TelegramUser {
  @PrimaryColumn()
  id: string;
  @Column({ default: true })
  subscribed: boolean;
}
