import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayersTournamentsAward } from './entities/players-tournaments-award.entity';

@Injectable()
export class PlayersTournamentsAwardsService {
  constructor(
    @InjectRepository(PlayersTournamentsAward)
    private readonly playersTournamentsAwardRepository: Repository<PlayersTournamentsAward>,
  ) {}

  findAll(): Promise<PlayersTournamentsAward[]> {
    return this.playersTournamentsAwardRepository.find();
  }
}
