import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { ILike, In, Not, Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamByLeague } from './entities/teamByLeague.entity';
import { TeamLogo } from '../team-logos/entities/team-logo.entity';
import { Nation } from '../nations/entities/nation.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(TeamLogo)
    private teamLogoRepository: Repository<TeamLogo>,
    @InjectRepository(TeamByLeague)
    private readonly teamByLeagueRepository: Repository<TeamByLeague>,
    @InjectRepository(Nation)
    private readonly nationRepository: Repository<Nation>,
  ) {}

  findAll(filter?: string): Promise<Team[]> {
    if (filter) {
      if (filter.length >= 2) {
        return this.teamRepository.find({
          relations: ['logos', 'nation'],
          where: [
            {
              full_name: ILike(`%${filter}%`),
            },
          ],
        });
      }
    }
    return this.teamRepository.find({
      relations: ['logos', 'nation'],
    });
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.teamRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.nation', 'nation')
      .leftJoinAndSelect('team.logos', 'logos')
      .where('team.id = :id', { id: id })
      .getOne();
    if (!team) {
      throw new NotFoundException(`Team #${id} not found`);
    }
    team.logos = team.logos.sort(
      (a, b) => (a.start_year || 0) - (b.start_year || 0),
    );
    return team;
  }

  async countByNationId(nation_id: number): Promise<number> {
    return this.teamRepository.count({
      where: { nation_id },
    });
  }

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const { logos, ...teamData } = createTeamDto;

    if (logos) {
      for (const logo of logos) {
        if (!logo.start_year) {
          throw new BadRequestException(
            'start_year is required for logos when creating a team',
          );
        }
      }
    }

    return await this.teamRepository.manager.transaction(
      async (transactionalEntityManager) => {
        let nation: Nation | null = null;
        if (teamData.nation_id) {
          nation = await transactionalEntityManager.findOne(Nation, {
            where: { id: teamData.nation_id },
          });
        }

        const team = this.teamRepository.create({
          ...teamData,
          nation,
        });
        const savedTeam = await transactionalEntityManager.save(team);

        if (logos && logos.length > 0) {
          const logoEntities = logos.map((logo) =>
            this.teamLogoRepository.create({
              logo: logo.logo,
              start_year: logo.start_year!,
              end_year: logo.end_year,
              team: savedTeam,
              team_id: savedTeam.id,
            }),
          );
          savedTeam.logos = await transactionalEntityManager.save(logoEntities);
        } else {
          savedTeam.logos = [];
        }
        const result = await transactionalEntityManager.findOne(Team, {
          where: { id: savedTeam.id },
          relations: ['nation', 'logos'],
        });

        return result;
      },
    );
  }

  async update(id: number, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const { logos, nation_id, ...teamData } = updateTeamDto;

    return await this.teamRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const team = await transactionalEntityManager.findOne(Team, {
          where: { id },
          relations: ['logos', 'nation'],
        });

        if (!team) {
          throw new NotFoundException(`Team with ID ${id} not found`);
        }

        if (nation_id !== undefined) {
          const nation = await transactionalEntityManager.findOne(Nation, {
            where: { id: nation_id },
          });
          team.nation = nation || null;
        }

        Object.assign(team, teamData);
        const updatedTeam = await transactionalEntityManager.save(Team, team);

        if (logos && logos.length > 0) {
          const incomingLogoIds = logos
            .filter((logo) => logo.id !== undefined)
            .map((logo) => logo.id!);
          await transactionalEntityManager.delete(TeamLogo, {
            team: { id },
            id:
              incomingLogoIds.length > 0 ? Not(In(incomingLogoIds)) : undefined,
          });

          const logoEntities = logos.map((logoDto) => {
            const logoEntity = logoDto.id
              ? transactionalEntityManager.create(TeamLogo, {
                  id: logoDto.id,
                  logo: logoDto.logo,
                  start_year: logoDto.start_year,
                  end_year: logoDto.end_year,
                  team: updatedTeam,
                  team_id: updatedTeam.id,
                })
              : transactionalEntityManager.create(TeamLogo, {
                  logo: logoDto.logo,
                  start_year: logoDto.start_year,
                  end_year: logoDto.end_year,
                  team: updatedTeam,
                  team_id: updatedTeam.id,
                });
            return logoEntity;
          });

          await transactionalEntityManager.save(TeamLogo, logoEntities);

          updatedTeam.logos = await transactionalEntityManager.find(TeamLogo, {
            where: { team: { id } },
          });
        } else if (logos && logos.length === 0) {
          await transactionalEntityManager.delete(TeamLogo, {
            team: { id },
          });
          updatedTeam.logos = [];
        }

        return updatedTeam;
      },
    );
  }

  async remove(id: number): Promise<Team> {
    const team = await this.findOne(id);
    return this.teamRepository.remove(team);
  }

  async teamsByLeague(query: { leagueId: number }): Promise<TeamByLeague[]> {
    const teamsByLeague = await this.teamByLeagueRepository.query(
      `SELECT DISTINCT ON (teams.full_name) teams.id, teams.nation_id, teams.full_name, nations.flag,
      team_logos.logo FROM teams
  		INNER JOIN nations ON teams.nation_id = nations.id
      INNER JOIN teams_tournaments ON teams.id = teams_tournaments.team_id
      INNER JOIN tournaments ON teams_tournaments.tournament_id = tournaments.id
  		INNER JOIN team_logos ON teams.id = team_logos.team_id
      WHERE tournaments.league_id = $1
      ORDER BY teams.full_name, team_logos.end_year DESC`,
      [query.leagueId],
    );
    return teamsByLeague;
  }
}
