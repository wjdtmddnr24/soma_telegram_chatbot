import { IMentoring } from 'src/common/interfaces/soma.interface';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Mentoring implements IMentoring {
  @PrimaryColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  state: string;
  @Column()
  createdAt: Date;
  @Column()
  mentoringDate: Date;
  @Column()
  appliedCnt: number;
  @Column()
  writer: string;
  @Column()
  applyStartDate: Date;
  @Column()
  applyEndDate: Date;
  @Column({ nullable: true })
  mentoringLocation?: string;
  @Column({ nullable: true })
  content?: string;
}
