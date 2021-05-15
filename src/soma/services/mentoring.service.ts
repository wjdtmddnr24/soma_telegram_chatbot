import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IMentoring } from 'src/common/interfaces/soma.interface';
import { Repository } from 'typeorm';
import { Mentoring } from '../entities/mentoring.entity';

@Injectable()
export class MentoringService {
  constructor(
    @InjectRepository(Mentoring)
    private mentoringsRepository: Repository<Mentoring>,
  ) {}

  async create(mentoring: IMentoring): Promise<IMentoring> {
    const m = this.mentoringsRepository.create(mentoring);
    return this.mentoringsRepository.save(m);
  }

  async getMentoringById(id: number): Promise<IMentoring> {
    return this.mentoringsRepository.findOne({ id });
  }

  async getMostRecentMentoring(): Promise<IMentoring> {
    return this.mentoringsRepository
      .createQueryBuilder()
      .where('id = (select max(id) from mentoring)')
      .getOne();
  }

  async getMentorings(): Promise<IMentoring[]> {
    return this.mentoringsRepository.find();
  }
}
