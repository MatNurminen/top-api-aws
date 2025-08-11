import { Repository } from 'typeorm';
import {
  CountPlayerByNation,
  PlayerStatDetail,
  PlayerStatLeague,
  PlayerStatTeam,
  PlayerStatTotal,
} from './entities/players-stats.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayersStatsTotalParamsDto } from './params-dto/players-stats-total.dto';
import { PlayersStatsDetailParamsDto } from './params-dto/players-stats-detail.dto';
import { CountPlayersByNationParamsDto } from './params-dto/count-players-by-nation.dto';

@Injectable()
export class PlayersStatsService {
  constructor(
    @InjectRepository(PlayerStatTotal)
    private readonly playerStatTotalRepository: Repository<PlayerStatTotal>,
    @InjectRepository(PlayerStatDetail)
    private readonly playerStatDetailRepository: Repository<PlayerStatDetail>,
    @InjectRepository(CountPlayerByNation)
    private readonly countPlayerByNationRepository: Repository<CountPlayerByNation>,
    @InjectRepository(PlayerStatLeague)
    private readonly playerStatLeagueRepository: Repository<PlayerStatLeague>,
    @InjectRepository(PlayerStatTeam)
    private readonly playerStatTeamRepository: Repository<PlayerStatTeam>,
  ) {}

  async playersStatsTotal(
    params: PlayersStatsTotalParamsDto,
  ): Promise<PlayerStatTotal[]> {
    const { leagueId, teamId, nationId, playerOrd, limit } = params;

    let query = `SELECT players_tournaments.player_id, players.first_name, players.last_name, 
      players.player_position, players.player_order, nations.flag AS player_flag, 
      SUM(players_tournaments.games) as games_t, SUM(players_tournaments.goals) as goals_t, 
      COUNT(*) as years 
      FROM players_tournaments
      INNER JOIN teams_tournaments ON players_tournaments.teams_tournament_id = teams_tournaments.id
      INNER JOIN tournaments ON teams_tournaments.tournament_id = tournaments.id
      INNER JOIN players ON players_tournaments.player_id = players.id
      INNER JOIN nations ON players.nation_id = nations.id
      WHERE true
    `;

    const queryParams: any[] = [];
    let paramIndex = 1;

    if (leagueId) {
      query += ` AND tournaments.league_id = $${paramIndex}`;
      queryParams.push(leagueId);
      paramIndex++;
    }
    if (teamId) {
      query += ` AND teams_tournaments.team_id = $${paramIndex}`;
      queryParams.push(teamId);
      paramIndex++;
    }
    if (nationId) {
      query += ` AND nations.id = $${paramIndex}`;
      queryParams.push(nationId);
      paramIndex++;
    }
    if (playerOrd && playerOrd.length > 0) {
      const placeholders = playerOrd.map(() => `$${paramIndex++}`).join(', ');
      query += ` AND players.player_order IN (${placeholders})`;
      queryParams.push(...playerOrd);
    }

    query += `
      GROUP BY 
        players_tournaments.player_id, 
        players.first_name, 
        players.last_name, 
        players.player_position, 
        players.player_order, 
        nations.flag
      ORDER BY goals_t DESC
    `;

    if (limit) {
      query += ` LIMIT $${paramIndex}`;
      queryParams.push(limit);
    }

    return await this.playerStatTotalRepository.query(query, queryParams);
  }

  async playersStatsDetails(
    params: PlayersStatsDetailParamsDto,
  ): Promise<PlayerStatDetail[]> {
    const {
      leagueId,
      excludeLeagueId,
      teamId,
      seasonId,
      nationId,
      playerId,
      typeId,
      limit,
      playerOrd,
    } = params;

    let query = seasonId
      ? `WITH current_season AS (SELECT $${1}::integer AS season_id) `
      : '';

    query += `
    SELECT players_tournaments.id, players_tournaments.teams_tournament_id,  players_tournaments.player_id,
      players_tournaments.games, players_tournaments.goals, players_tournaments.postseason, players.first_name, 
      players.last_name, players.jersey_number, players.player_position, players.player_order, 
      players.nation_id, players.birth_year, players.height, players.weight, players.draft_team_id, 
      players.birth_year, players.height, tournaments.season_id, tournaments.league_id, teams_tournaments.team_id, 
      teams.full_name, leagues.short_name, seasons.name, nations_player.flag AS player_flag, 
      nations_team.flag AS team_flag, leagues.type_id, player_club.club_name 
      FROM players_tournaments
      INNER JOIN players ON players_tournaments.player_id = players.id
      INNER JOIN teams_tournaments ON players_tournaments.teams_tournament_id = teams_tournaments.id
      INNER JOIN teams ON teams_tournaments.team_id = teams.id
      INNER JOIN tournaments ON teams_tournaments.tournament_id = tournaments.id
      INNER JOIN leagues ON tournaments.league_id = leagues.id
      INNER JOIN seasons ON tournaments.season_id = seasons.id
      INNER JOIN nations AS nations_player ON players.nation_id = nations_player.id
      INNER JOIN nations AS nations_team ON teams.nation_id = nations_team.id
      LEFT JOIN (
        SELECT DISTINCT ON (pt.player_id)
          pt.player_id, 
          t.full_name AS club_name
        FROM players_tournaments pt
        INNER JOIN teams_tournaments tt ON pt.teams_tournament_id = tt.id
        INNER JOIN teams t ON tt.team_id = t.id
        INNER JOIN tournaments tr ON tt.tournament_id = tr.id
        INNER JOIN leagues l ON tr.league_id = l.id
        WHERE l.type_id = 1 
          ${seasonId ? `AND tr.season_id = (SELECT season_id FROM current_season)` : ''}
      ) player_club ON player_club.player_id = players_tournaments.player_id
      WHERE true
    `;

    const queryParams: any[] = seasonId ? [Number(seasonId)] : [];
    let paramIndex = seasonId ? 2 : 1;

    if (leagueId && leagueId.length > 0) {
      const placeholders = leagueId.map(() => `$${paramIndex++}`).join(', ');
      query += ` AND leagues.id IN (${placeholders})`; // Изменено с leagues.league_id на leagues.id
      queryParams.push(...leagueId.map((id) => Number(id)));
    }
    if (excludeLeagueId && excludeLeagueId.length > 0) {
      const placeholders = excludeLeagueId
        .map(() => `$${paramIndex++}`)
        .join(', ');
      query += ` AND leagues.id NOT IN (${placeholders})`; // Изменено с leagues.league_id на leagues.id
      queryParams.push(...excludeLeagueId.map((id) => Number(id)));
    }
    if (teamId) {
      query += ` AND teams_tournaments.team_id = $${paramIndex}`;
      queryParams.push(Number(teamId));
      paramIndex++;
    }
    if (seasonId) {
      query += ` AND tournaments.season_id = (SELECT season_id FROM current_season)`;
    }
    if (nationId) {
      query += ` AND players.nation_id = $${paramIndex}`;
      queryParams.push(Number(nationId));
      paramIndex++;
    }
    if (playerId) {
      query += ` AND players_tournaments.player_id = $${paramIndex}`;
      queryParams.push(Number(playerId));
      paramIndex++;
    }
    if (typeId) {
      query += ` AND leagues.type_id = $${paramIndex}`;
      queryParams.push(Number(typeId));
      paramIndex++;
    }
    if (playerOrd && playerOrd.length > 0) {
      const placeholders = playerOrd.map(() => `$${paramIndex++}`).join(', ');
      query += ` AND players.player_order IN (${placeholders})`;
      queryParams.push(...playerOrd.map((ord) => Number(ord)));
    }

    query += ` ORDER BY goals DESC`;

    if (limit) {
      query += ` LIMIT $${paramIndex}`;
      queryParams.push(Number(limit));
    }
    try {
      return await this.playerStatDetailRepository.query(query, queryParams);
    } catch (error) {
      console.error('Query error:', error);
      throw error;
    }
  }

  async countPlayersByNation(
    params: CountPlayersByNationParamsDto,
  ): Promise<CountPlayerByNation[]> {
    const { leagueId, seasonId, teamId, typeId } = params;

    let query = `SELECT nations.id, nations.name, nations.flag, nations.color,
      COUNT(DISTINCT players.id) as count FROM players_tournaments
      INNER JOIN teams_tournaments ON players_tournaments.teams_tournament_id = teams_tournaments.id
      INNER JOIN tournaments ON teams_tournaments.tournament_id = tournaments.id
      INNER JOIN seasons ON tournaments.season_id = seasons.id
      INNER JOIN leagues ON tournaments.league_id = leagues.id
      INNER JOIN players ON players_tournaments.player_id = players.id
      INNER JOIN nations ON players.nation_id = nations.id
      WHERE true
    `;

    const queryParams: any[] = [];
    let paramIndex = 1;

    if (leagueId) {
      query += ` AND tournaments.league_id = $${paramIndex}`;
      queryParams.push(leagueId);
      paramIndex++;
    }
    if (teamId) {
      query += ` AND teams_tournaments.team_id = $${paramIndex}`;
      queryParams.push(teamId);
      paramIndex++;
    }
    if (seasonId) {
      query += ` AND tournaments.season_id = $${paramIndex}`;
      queryParams.push(seasonId);
      paramIndex++;
    }
    if (typeId) {
      query += ` AND leagues.type_id = $${paramIndex}`;
      queryParams.push(typeId);
      paramIndex++;
    }

    query += `
      GROUP BY nations.id, nations.name, nations.flag, nations.color
      ORDER BY count DESC
    `;

    return await this.countPlayerByNationRepository.query(query, queryParams);
  }

  async playersStatsLeagues(query: {
    playerId: number;
  }): Promise<PlayerStatLeague[]> {
    const playersStatsLeagues = await this.playerStatLeagueRepository.query(
      `SELECT tournaments.league_id, leagues.short_name, league_logos.logo,
      SUM(players_tournaments.games) as games_t, SUM(players_tournaments.goals) as goals_t,
      COUNT(tournaments.season_id) as years  FROM players_tournaments
      INNER JOIN teams_tournaments ON players_tournaments.teams_tournament_id = teams_tournaments.id
      INNER JOIN tournaments ON teams_tournaments.tournament_id = tournaments.id
      INNER JOIN players ON players_tournaments.player_id = players.id
      INNER JOIN leagues ON tournaments.league_id = leagues.id
	    INNER JOIN league_logos ON leagues.id = league_logos.league_id
      WHERE league_logos.end_year IS NULL AND players_tournaments.player_id = $1
      GROUP BY tournaments.league_id, leagues.short_name, league_logos.logo
      ORDER BY years DESC`,
      [query.playerId],
    );
    return playersStatsLeagues;
  }

  async playersStatsTeams(query: {
    playerId: number;
  }): Promise<PlayerStatTeam[]> {
    const playersStatsTeams = await this.playerStatTeamRepository.query(
      `SELECT teams_tournaments.team_id, teams.full_name, nations.flag,
      SUM(players_tournaments.games) as games_t, SUM(players_tournaments.goals) as goals_t,
      COUNT(tournaments.season_id) as years FROM players_tournaments
      INNER JOIN teams_tournaments ON players_tournaments.teams_tournament_id = teams_tournaments.id
      INNER JOIN tournaments ON teams_tournaments.tournament_id = tournaments.id
      INNER JOIN players ON players_tournaments.player_id = players.id
      INNER JOIN teams ON teams_tournaments.team_id = teams.id
      INNER JOIN nations ON teams.nation_id = nations.id
      WHERE players_tournaments.player_id = $1
      GROUP BY teams_tournaments.team_id, teams.full_name, nations.flag
      ORDER BY years DESC`,
      [query.playerId],
    );
    return playersStatsTeams;
  }
}
