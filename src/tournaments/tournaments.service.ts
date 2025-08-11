import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { Repository } from 'typeorm';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { Season } from '../seasons/entities/season.entity';
import { League } from '../leagues/entities/league.entity';
import { validateEntityExists } from '../common/utils/entity-validator.util';
import { TournamentByLeague } from './entities/tournamentByLeague.entity';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(Season)
    private readonly seasonRepository: Repository<Season>,
    @InjectRepository(League)
    private readonly leagueRepository: Repository<League>,
  ) {}

  findAll(): Promise<Tournament[]> {
    return this.tournamentRepository.find({});
  }

  async findOne(id: number): Promise<Tournament> {
    const tournament = await this.tournamentRepository
      .createQueryBuilder('tournament')
      .leftJoinAndSelect('tournament.league', 'league')
      .where('tournament.id = :id', { id: id })
      .getOne();
    if (!tournament) {
      throw new NotFoundException(`Tournament #${id} not found`);
    }
    return tournament;
  }

  async create(createTournamentDto: CreateTournamentDto): Promise<Tournament> {
    const { season_id, league_id } = createTournamentDto;

    await Promise.all([
      validateEntityExists(this.seasonRepository, Season, season_id, 'Season'),
      validateEntityExists(this.leagueRepository, League, league_id, 'League'),
    ]);

    const tournament = this.tournamentRepository.create(createTournamentDto);
    return this.tournamentRepository.save(tournament);
  }

  async update(
    id: number,
    updateTournamentDto: UpdateTournamentDto,
  ): Promise<Tournament> {
    const existingTournament = await this.findOne(id);

    const seasonId =
      updateTournamentDto.season_id ?? existingTournament.season_id;
    const leagueId =
      updateTournamentDto.league_id ?? existingTournament.league_id;

    await Promise.all([
      validateEntityExists(this.seasonRepository, Season, seasonId, 'Season'),
      validateEntityExists(this.leagueRepository, League, leagueId, 'League'),
    ]);

    const tournament = await this.tournamentRepository.preload({
      id: +id,
      ...updateTournamentDto,
    });

    if (!tournament) {
      throw new NotFoundException(`Tournament #${id} not found`);
    }
    return this.tournamentRepository.save(tournament);
  }

  async remove(id: number): Promise<Tournament> {
    const tournament = await this.findOne(id);
    return this.tournamentRepository.remove(tournament);
  }

  async tournamentsByLeague(query: {
    leagueId: number;
  }): Promise<TournamentByLeague[]> {
    const teamsByLeague = await this.tournamentRepository.query(
      `SELECT tournaments.*, seasons.name as season, leagues.name as league, 
      league_logos.logo FROM tournaments 
      INNER JOIN seasons ON tournaments.season_id = seasons.id 
      INNER JOIN leagues ON tournaments.league_id = leagues.id
	    INNER JOIN league_logos ON leagues.id = league_logos.league_id 
      WHERE tournaments.league_id = $1 AND league_logos.end_year IS NULL
	    ORDER BY season_id DESC`,
      [query.leagueId],
    );
    return teamsByLeague;
  }
}
