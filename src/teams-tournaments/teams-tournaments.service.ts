import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamTournament } from './entities/team-tournament.entity';
import { Repository } from 'typeorm';
import { CreateTeamTournamentDto } from './dto/create-team-tournament.dto';
import { UpdateTeamTournamentDto } from './dto/update-team-tournament.dto';
import { TeamsByTournament } from './entities/teamsByTournament.entity';

@Injectable()
export class TeamsTournamentsService {
  constructor(
    @InjectRepository(TeamTournament)
    private readonly teamTournamentRepository: Repository<TeamTournament>,
  ) {}

  findAll(): Promise<TeamTournament[]> {
    return this.teamTournamentRepository.find({});
  }

  async findOne(id: number): Promise<TeamTournament> {
    const teamTournament = await this.teamTournamentRepository.findOne({
      where: { id },
    });
    if (!teamTournament) {
      throw new NotFoundException(`Team of tournament #${id} not found`);
    }
    return teamTournament;
  }

  create(
    createTeamTournamentDto: CreateTeamTournamentDto,
  ): Promise<TeamTournament> {
    const teamTournament = this.teamTournamentRepository.create(
      createTeamTournamentDto,
    );
    return this.teamTournamentRepository.save(teamTournament);
  }

  async update(
    id: number,
    updateTeamTournamentDto: UpdateTeamTournamentDto,
  ): Promise<TeamTournament> {
    const teamTournament = await this.teamTournamentRepository.preload({
      id: +id,
      ...updateTeamTournamentDto,
    });
    if (!teamTournament) {
      throw new NotFoundException(`Team of tournament #${id} not found`);
    }
    return this.teamTournamentRepository.save(teamTournament);
  }

  async remove(id: number): Promise<TeamTournament> {
    const teamTournament = await this.findOne(id);
    return this.teamTournamentRepository.remove(teamTournament);
  }

  async teamsByTournament(query: {
    tournamentId: number;
  }): Promise<TeamsByTournament[]> {
    const teamsByTournament = await this.teamTournamentRepository.query(
      `SELECT teams_tournaments.id, teams_tournaments.team_id, teams.full_name, 
      nations.flag, tournaments.league_id, leagues.name AS league_name, 
      tournaments.season_id, seasons.name AS season_name FROM teams_tournaments
      INNER JOIN tournaments ON teams_tournaments.tournament_id = tournaments.id
      INNER JOIN teams ON teams_tournaments.team_id = teams.id
      INNER JOIN nations ON teams.nation_id = nations.id
      INNER JOIN leagues ON tournaments.league_id = leagues.id
      INNER JOIN seasons ON tournaments.season_id = seasons.id
      WHERE teams_tournaments.tournament_id = $1
      ORDER BY full_name`,
      [query.tournamentId],
    );
    return teamsByTournament;
  }
}
