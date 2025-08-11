import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeagueType } from './entities/league-type.entity';

@Injectable()
export class LeagueTypesService {
  constructor(
    @InjectRepository(LeagueType)
    private readonly leagueTypeRepository: Repository<LeagueType>,
  ) {}

  findAll(): Promise<LeagueType[]> {
    return this.leagueTypeRepository.find({});
  }
}
