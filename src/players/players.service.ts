import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { ILike, Repository } from 'typeorm';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { FreeAgent } from './entities/free-agent.entity';
import {
  DraftDetail,
  DraftNation,
  DraftTeam,
} from './entities/drat-player.entity';
import { DraftDetailParamsDto } from './params-dto/draft-detail.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    @InjectRepository(FreeAgent)
    private readonly freeAgentRepository: Repository<FreeAgent>,
    @InjectRepository(DraftNation)
    private readonly draftNationRepository: Repository<DraftNation>,
    @InjectRepository(DraftTeam)
    private readonly draftTeamRepository: Repository<DraftTeam>,
    @InjectRepository(DraftDetail)
    private readonly draftDetailRepository: Repository<DraftDetail>,
  ) {}

  async findAll(filter?: string): Promise<Player[]> {
    if (filter) {
      const terms = filter.trim().split(/\s+/);

      if (terms.length === 1) {
        return this.playerRepository.find({
          relations: ['nation'],
          where: [
            { first_name: ILike(`%${terms[0]}%`) },
            { last_name: ILike(`%${terms[0]}%`) },
          ],
        });
      }

      if (terms.length >= 2) {
        return this.playerRepository.find({
          relations: ['nation'],
          where: [
            {
              first_name: ILike(`%${terms[0]}%`),
              last_name: ILike(`%${terms[1]}%`),
            },
            {
              first_name: ILike(`%${terms[1]}%`),
              last_name: ILike(`%${terms[0]}%`),
            },
          ],
        });
      }
    }

    return this.playerRepository.find();
  }

  async findOne(id: number): Promise<Player> {
    const player = await this.playerRepository
      .createQueryBuilder('player')
      .leftJoinAndSelect('player.nation', 'nation')
      .leftJoinAndSelect('player.team', 'team')
      .leftJoinAndSelect(
        'team.logos',
        'teams_logos',
        'teams_logos.end_year IS NULL',
      )
      .where('player.id = :id', { id: id })
      .getOne();
    if (!player) {
      throw new NotFoundException(`Player #${id} not found`);
    }
    return player;
  }

  async countByNationId(nation_id: number): Promise<number> {
    return this.playerRepository.count({
      where: { nation_id },
    });
  }

  async freeAgents(query: {
    seasonId: number;
    nationId: number;
  }): Promise<FreeAgent[]> {
    const freeAgents = await this.freeAgentRepository.query(
      `SELECT players_tournaments.id AS pt_id, players.*, nations.flag
        FROM players_tournaments
        INNER JOIN teams_tournaments ON players_tournaments.teams_tournament_id = teams_tournaments.id
        INNER JOIN tournaments ON teams_tournaments.tournament_id = tournaments.id
        RIGHT JOIN players ON players_tournaments.player_id = players.id AND tournaments.season_id = $1
        INNER JOIN nations ON players.nation_id = nations.id
        WHERE players_tournaments.id IS NULL
        AND players.start_year <= $1 AND (end_year > $1 OR end_year ISNULL)
        AND nation_id = $2`,
      [query.seasonId, query.nationId],
    );
    return freeAgents;
  }

  async draftNations(): Promise<DraftNation[]> {
    const draftNations = await this.draftNationRepository.query(
      `SELECT nations.id, nations.name, nations.flag, COUNT(players.id) as plrs 
        FROM players INNER JOIN teams ON players.draft_team_id = teams.id 
        INNER JOIN nations ON players.nation_id = nations.id 
        GROUP BY (nations.id, nations.name, nations.flag) 
        ORDER BY nations.name`,
    );
    return draftNations;
  }

  async draftTeams(): Promise<DraftTeam[]> {
    const draftTeams = await this.draftTeamRepository.query(
      `SELECT teams.id, teams.full_name, team_logos.logo, 
        COUNT(players.id) as plrs FROM players
        INNER JOIN teams ON players.draft_team_id = teams.id
        INNER JOIN team_logos ON teams.id = team_logos.team_id
        WHERE team_logos.end_year IS NULL
        GROUP BY (teams.id, teams.full_name, team_logos.logo)
        ORDER BY teams.full_name`,
    );
    return draftTeams;
  }

  async draftDetails(params: DraftDetailParamsDto): Promise<DraftDetail[]> {
    const { nationId, teamId } = params;

    let query = `SELECT tournaments.league_id, leagues.short_name, players.id, 
      players.player_position, players.first_name, players.last_name, players.draft_team_id, 
      teams.full_name, nations.name, nations.flag,
      SUM(players_tournaments.games) as games_t, SUM(players_tournaments.goals) as goals_t,
      COUNT(tournaments.league_id) AS years_t
      FROM players_tournaments
      INNER JOIN teams_tournaments ON players_tournaments.teams_tournament_id = teams_tournaments.id
      INNER JOIN tournaments ON teams_tournaments.tournament_id = tournaments.id
      INNER JOIN leagues ON tournaments.league_id = leagues.id
      RIGHT JOIN players ON players_tournaments.player_id = players.id AND tournaments.league_id = 14
      INNER JOIN nations ON players.nation_id = nations.id
      INNER JOIN teams ON players.draft_team_id = teams.id
      WHERE true`;

    const queryParams: any[] = [];
    let paramIndex = 1;

    if (nationId) {
      query += ` AND players.nation_id = $${paramIndex}`;
      queryParams.push(nationId);
      paramIndex++;
    }
    if (teamId) {
      query += ` AND players.draft_team_id = $${paramIndex}`;
      queryParams.push(teamId);
      paramIndex++;
    }

    query += ` AND players.draft_team_id IS NOT NULL
      GROUP BY tournaments.league_id, leagues.short_name, players.id, 
      players.player_position, players.first_name, players.last_name, 
      players.draft_team_id, teams.full_name, nations.name, nations.flag
      ORDER BY players.last_name`;

    return await this.draftDetailRepository.query(query, queryParams);
  }

  create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = this.playerRepository.create(createPlayerDto);
    return this.playerRepository.save(player);
  }

  async update(id: number, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    const player = await this.playerRepository.preload({
      id: id,
      ...updatePlayerDto,
    });

    if (!player) {
      throw new NotFoundException(`Player #${id} not found`);
    }

    const savedPlayer = await this.playerRepository.save(player);
    return this.findOne(savedPlayer.id);
  }

  async remove(id: number): Promise<Player> {
    const player = await this.findOne(id);
    return this.playerRepository.remove(player);
  }
}
