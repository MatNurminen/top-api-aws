import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayersTournamentsAward } from './entities/players-tournaments-award.entity';
import { CreatePlayersTournamentsAwardDto } from './dto/create-players-tournaments-award.dto';
import { validateEntityExists } from '../common/utils/entity-validator.util';
import { PlayerTournament } from '../players-tournaments/entities/player-tournament.entity';
import { Award } from 'src/awards/entities/award.entity';

@Injectable()
export class PlayersTournamentsAwardsService {
  constructor(
    @InjectRepository(PlayersTournamentsAward)
    private readonly playersTournamentsAwardRepository: Repository<PlayersTournamentsAward>,
    @InjectRepository(PlayerTournament)
    private readonly playerTournamentRepository: Repository<PlayerTournament>,
    @InjectRepository(Award)
    private readonly awardRepository: Repository<Award>,
  ) {}

  findAll(): Promise<PlayersTournamentsAward[]> {
    return this.playersTournamentsAwardRepository.find();
  }

  async findOne(id: number): Promise<PlayersTournamentsAward> {
    const playersTournamentsAward =
      await this.playersTournamentsAwardRepository.findOne({
        where: { id },
      });
    if (!playersTournamentsAward) {
      throw new NotFoundException(`Player Tournament Award #${id} not found`);
    }
    return playersTournamentsAward;
  }

  async create(
    createPlayersTournamentsAwardDto: CreatePlayersTournamentsAwardDto,
  ): Promise<PlayersTournamentsAward> {
    const { players_tournament_id, award_id } =
      createPlayersTournamentsAwardDto;

    await Promise.all([
      validateEntityExists(
        this.playerTournamentRepository,
        PlayerTournament,
        players_tournament_id,
        'PlayerTournament',
      ),
      validateEntityExists(this.awardRepository, Award, award_id, 'Award'),
    ]);

    const playerTournamentsAward =
      this.playersTournamentsAwardRepository.create(
        createPlayersTournamentsAwardDto,
      );
    return this.playersTournamentsAwardRepository.save(playerTournamentsAward);
  }

  async remove(id: number): Promise<PlayersTournamentsAward> {
    const playersTournamentsAward = await this.findOne(id);
    return this.playersTournamentsAwardRepository.remove(
      playersTournamentsAward,
    );
  }
}
