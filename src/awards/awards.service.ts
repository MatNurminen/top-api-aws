import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Award } from './entities/award.entity';

@Injectable()
export class AwardsService {
  constructor(
    @InjectRepository(Award)
    private readonly awardRepository: Repository<Award>,
  ) {}

  findAll(): Promise<Award[]> {
    return this.awardRepository.find();
  }
}
