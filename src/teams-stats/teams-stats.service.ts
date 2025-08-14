import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Standing } from './entities/standing.entity';
import { Repository } from 'typeorm';
import { TeamForNation } from './entities/teamsForNation.entity';
import { TeamsForNationDto } from './params-dto/teams-for-nation.dto';
import { TeamFact } from './entities/teamsFacts';
import { TeamsStandingDto } from './params-dto/teams-standing.dto';

@Injectable()
export class TeamsStatsService {
  constructor(
    @InjectRepository(Standing)
    private readonly teamStatsRepository: Repository<Standing>,
    @InjectRepository(TeamForNation)
    private readonly teamForNationRepository: Repository<TeamForNation>,
    @InjectRepository(TeamFact)
    private readonly teamFactsRepository: Repository<TeamFact>,
  ) {}

  async standings(params: TeamsStandingDto): Promise<Standing[]> {
    const { seasonId, leagueId, teamId, typeId } = params;

    let query = `SELECT teams_tournaments.*, teams_tournaments.goals_for - teams_tournaments.goals_against as gd, 
      teams_tournaments.wins * 2 + teams_tournaments.ties as pts, teams.full_name, team_logos.logo, tournaments.season_id, 
      leagues.name, seasons.name AS season FROM teams_tournaments 
      INNER JOIN teams ON teams_tournaments.team_id = teams.id
      INNER JOIN team_logos ON teams.id = team_logos.team_id
      INNER JOIN tournaments ON teams_tournaments.tournament_id = tournaments.id
      INNER JOIN leagues ON tournaments.league_id = leagues.id
      INNER JOIN seasons ON tournaments.season_id = seasons.id
      WHERE team_logos.start_year <= tournaments.season_id 
	    AND (team_logos.end_year >= tournaments.season_id 
	    OR team_logos.end_year IS NULL)
      `;
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (seasonId) {
      query += ` AND seasons.id = $${paramIndex}`;
      queryParams.push(seasonId);
      paramIndex++;
    }
    if (leagueId) {
      query += ` AND leagues.id = $${paramIndex}`;
      queryParams.push(leagueId);
      paramIndex++;
    }
    if (teamId) {
      query += ` AND teams.id = $${paramIndex}`;
      queryParams.push(teamId);
      paramIndex++;
    }
    if (typeId) {
      query += ` AND leagues.type_id = $${paramIndex}`;
      queryParams.push(typeId);
      paramIndex++;
    }

    query += ` ORDER BY pts DESC`;

    return await this.teamStatsRepository.query(query, queryParams);
  }

  async teamsForNation(params: TeamsForNationDto): Promise<TeamForNation[]> {
    const { nationId, shortName, typeId, limit } = params;

    let query = `SELECT tournaments.season_id, leagues.short_name, teams_tournaments.postseason, 
      leagues.id AS league_id, teams.id AS team_id FROM tournaments
      INNER JOIN leagues ON tournaments.league_id = leagues.id
      INNER JOIN teams_tournaments ON tournaments.id = teams_tournaments.tournament_id
      INNER JOIN teams ON teams_tournaments.team_id = teams.id
      WHERE true
      `;

    const queryParams: any[] = [];
    let paramIndex = 1;

    if (nationId) {
      query += ` AND nation_id = $${paramIndex}`;
      queryParams.push(nationId);
      paramIndex++;
    }
    if (shortName) {
      query += ` AND leagues.short_name LIKE $${paramIndex}`;
      queryParams.push(shortName);
      paramIndex++;
    }
    if (typeId) {
      query += ` AND leagues.type_id = $${paramIndex}`;
      queryParams.push(shortName);
      paramIndex++;
    }
    if (limit) {
      query += ` LIMIT $${paramIndex}`;
      queryParams.push(limit);
    }

    return await this.teamForNationRepository.query(query, queryParams);
  }

  async teamFacts(query: {
    leagueId: number;
    seasonId: number;
  }): Promise<TeamFact[]> {
    const teamFacts = await this.teamFactsRepository.query(
      `SELECT teams.id as team_id, teams.full_name, team_logos.logo, COUNT(players.id) as plrs,
      ROUND(AVG(players.height), 2) as avheight, 
      ROUND(AVG(players.weight), 2) as avweight,
      ROUND(AVG(tournaments.season_id - players.birth_year), 2) as avage
      FROM players_tournaments
      INNER JOIN teams_tournaments ON players_tournaments.teams_tournament_id = teams_tournaments.id
      INNER JOIN tournaments ON teams_tournaments.tournament_id = tournaments.id
      INNER JOIN players ON players_tournaments.player_id = players.id
      INNER JOIN teams ON teams_tournaments.team_id = teams.id
      INNER JOIN team_logos ON teams.id = team_logos.team_id
      WHERE team_logos.start_year <= tournaments.season_id 
	    AND (team_logos.end_year >= tournaments.season_id 
	    OR team_logos.end_year IS NULL) 
      AND tournaments.league_id = $1 AND tournaments.season_id = $2
      GROUP BY teams.id, teams.full_name, team_logos.logo ORDER BY teams.full_name`,
      [query.leagueId, query.seasonId],
    );
    return teamFacts;
  }
}
