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
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { AwardsStatsParamsDto } from './params-dto/awards-stats.dto';

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

  async awardsStatsDetails(
    params: AwardsStatsParamsDto,
  ): Promise<PaginatedResponseDto<AwardStatsDetails>> {
    const { leagueId, awardId, limit, offset } = params;

    let query = `SELECT awards.id, awards.name, players.id AS player_id, players.first_name, players.last_name, players.birth_year,
        players.player_position, nations.flag, tournaments.season_id, teams.full_name, teams.id AS team_id,
        COUNT(*) OVER() AS total
        FROM players_tournaments_awards
        INNER JOIN awards ON players_tournaments_awards.award_id = awards.id
        INNER JOIN players_tournaments ON players_tournaments_awards.players_tournament_id = players_tournaments.id
        INNER JOIN players ON players_tournaments.player_id = players.id
		    INNER JOIN nations ON players.nation_id = nations.id
        INNER JOIN teams_tournaments ON players_tournaments.teams_tournament_id = teams_tournaments.id
        INNER JOIN tournaments ON teams_tournaments.tournament_id = tournaments.id
        INNER JOIN teams ON teams_tournaments.team_id = teams.id
        WHERE awards.league_id = $1 AND awards.id = $2
        ORDER BY season_id DESC, players.player_order, players.last_name`;

    const queryParams: number[] = [leagueId, awardId];
    let paramIndex = 3;

    if (limit) {
      query += ` LIMIT $${paramIndex}`;
      queryParams.push(Number(limit));
      paramIndex++;
    }
    if (offset) {
      query += ` OFFSET $${paramIndex}`;
      queryParams.push(Number(offset));
    }

    const awardsStatsDetails = await this.awardStatsDetailsRepository.query(
      query,
      queryParams,
    );
    return new PaginatedResponseDto(
      awardsStatsDetails,
      Number(awardsStatsDetails[0]?.total ?? 0),
      limit,
      offset,
    );
  }

  async awardsStatsTotals(
    params: AwardsStatsParamsDto,
  ): Promise<PaginatedResponseDto<AwardStatsTotals>> {
    const { leagueId, awardId, limit, offset } = params;

    let query = `SELECT awards.id, awards.name, players.id AS player_id, players.first_name, players.last_name, players.birth_year,
        players.player_position, nations.flag,
		    COUNT(awards.id) as awards,
        COUNT(*) OVER() AS total
        FROM players_tournaments_awards
        INNER JOIN awards ON players_tournaments_awards.award_id = awards.id
        INNER JOIN players_tournaments ON players_tournaments_awards.players_tournament_id = players_tournaments.id
        INNER JOIN players ON players_tournaments.player_id = players.id
		    INNER JOIN nations ON players.nation_id = nations.id
        WHERE awards.league_id = $1 AND awards.id = $2
		    GROUP BY (awards.id, awards.name, players.id, players.first_name, players.last_name, players.birth_year, 
        players.player_position, nations.flag)
        ORDER BY awards DESC, players.last_name`;

    const queryParams: number[] = [leagueId, awardId];
    let paramIndex = 3;

    if (limit) {
      query += ` LIMIT $${paramIndex}`;
      queryParams.push(Number(limit));
      paramIndex++;
    }
    if (offset) {
      query += ` OFFSET $${paramIndex}`;
      queryParams.push(Number(offset));
    }

    const awardsStatsTotals = await this.awardStatsTotalsRepository.query(
      query,
      queryParams,
    );
    return new PaginatedResponseDto(
      awardsStatsTotals,
      Number(awardsStatsTotals[0]?.total ?? 0),
      limit,
      offset,
    );
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
