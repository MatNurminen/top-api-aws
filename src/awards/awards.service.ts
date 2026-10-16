import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Award } from './entities/award.entity';
import { CreateAwardDto } from './dto/create-award.dto';
import { League } from '../leagues/entities/league.entity';
import { validateEntityExists } from '../common/utils/entity-validator.util';
import { UpdateAwardDto } from './dto/update-award.dto';
import {
  AwardStatsDetails,
  AwardStatsTotals,
} from './entities/awardStats.entity';

@Injectable()
export class AwardsService {
  constructor(
    @InjectRepository(Award)
    private readonly awardRepository: Repository<Award>,
    @InjectRepository(League)
    private readonly leagueRepository: Repository<League>,
    @InjectRepository(AwardStatsDetails)
    private readonly awardStatsDetailsRepository: Repository<AwardStatsDetails>,
    @InjectRepository(AwardStatsTotals)
    private readonly awardStatsTotalsRepository: Repository<AwardStatsTotals>,
  ) {}

  findAll(): Promise<Award[]> {
    return this.awardRepository.find();
  }

  async findOne(id: number): Promise<Award> {
    const award = await this.awardRepository.findOne({
      where: { id },
    });
    if (!award) {
      throw new NotFoundException(`Award #${id} not found`);
    }
    return award;
  }

  async findAwardsByLeague(league_id: number): Promise<Award[]> {
    return this.awardRepository.find({
      where: { league_id },
      order: { name: 'ASC' },
    });
  }

  async awardsStatsDetails(query: {
    leagueId: number;
    awardId: number;
  }): Promise<AwardStatsDetails[]> {
    const awardsStatsDetails = await this.awardStatsDetailsRepository.query(
      `SELECT awards.id, awards.name, players.first_name, players.last_name, players.birth_year,
        players.player_position, tournaments.season_id, teams.full_name, teams.id AS team_id
        FROM players_tournaments_awards
        INNER JOIN awards ON players_tournaments_awards.award_id = awards.id
        INNER JOIN players_tournaments ON players_tournaments_awards.players_tournament_id = players_tournaments.id
        INNER JOIN players ON players_tournaments.player_id = players.id
        INNER JOIN teams_tournaments ON players_tournaments.teams_tournament_id = teams_tournaments.id
        INNER JOIN tournaments ON teams_tournaments.tournament_id = tournaments.id
        INNER JOIN teams ON teams_tournaments.team_id = teams.id
        WHERE awards.league_id = $1 AND awards.id = $2
        ORDER BY season_id DESC, players.player_order, players.last_name`,
      [query.leagueId, query.awardId],
    );
    return awardsStatsDetails;
  }

  async awardsStatsTotals(query: {
    leagueId: number;
    awardId: number;
  }): Promise<AwardStatsTotals[]> {
    const awardsStatsDetails = await this.awardStatsTotalsRepository.query(
      `SELECT awards.id, awards.name, players.first_name, players.last_name, players.birth_year,
        players.player_position,
		    COUNT(awards.id) as awards 
        FROM players_tournaments_awards
        INNER JOIN awards ON players_tournaments_awards.award_id = awards.id
        INNER JOIN players_tournaments ON players_tournaments_awards.players_tournament_id = players_tournaments.id
        INNER JOIN players ON players_tournaments.player_id = players.id
        WHERE awards.league_id = $1 AND awards.id = $2
		    GROUP BY (awards.id, awards.name, players.first_name, players.last_name, players.birth_year, players.player_position)
        ORDER BY awards, players.last_name`,
      [query.leagueId, query.awardId],
    );
    return awardsStatsDetails;
  }

  async create(createAwardDto: CreateAwardDto): Promise<Award> {
    const { league_id } = createAwardDto;

    await Promise.all([
      validateEntityExists(this.leagueRepository, League, league_id, 'League'),
    ]);

    const award = this.awardRepository.create(createAwardDto);
    return this.awardRepository.save(award);
  }

  async update(id: number, updateAwardDto: UpdateAwardDto): Promise<Award> {
    const award = await this.awardRepository.preload({
      id: id,
      ...updateAwardDto,
    });

    if (!award) {
      throw new NotFoundException(`Award #${id} not found`);
    }

    const savedAward = await this.awardRepository.save(award);
    return this.findOne(savedAward.id);
  }

  async remove(id: number): Promise<Award> {
    const award = await this.findOne(id);
    return this.awardRepository.remove(award);
  }
}
