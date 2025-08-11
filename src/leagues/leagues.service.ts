import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { League } from './entities/league.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { LeagueLogo } from '../league-logos/entities/league-logo.entity';
import { LeagueByNation } from './entities/leagueByNation.entity';

@Injectable()
export class LeaguesService {
  constructor(
    @InjectRepository(League)
    private readonly leagueRepository: Repository<League>,
    @InjectRepository(LeagueLogo)
    private leagueLogoRepository: Repository<LeagueLogo>,
    @InjectRepository(LeagueByNation)
    private leagueByNationRepository: Repository<LeagueByNation>,
  ) {}

  findAll(): Promise<League[]> {
    return this.leagueRepository.find({
      relations: ['logos'],
    });
  }

  async findAllWithCurLogo(): Promise<League[]> {
    return this.leagueRepository
      .createQueryBuilder('league')
      .leftJoinAndSelect('league.logos', 'logo', 'logo.end_year IS NULL')
      .orderBy('league.name', 'ASC')
      .getMany();
  }

  async leaguesByNation(query: {
    nationId: number;
  }): Promise<LeagueByNation[]> {
    const leaguesByNation = await this.leagueByNationRepository.query(
      `SELECT DISTINCT ON (leagues.short_name) leagues.id, leagues.short_name, 
      nations.flag FROM tournaments
      INNER JOIN leagues ON tournaments.league_id = leagues.id
      INNER JOIN teams_tournaments ON tournaments.id = teams_tournaments.tournament_id
      INNER JOIN teams ON teams_tournaments.team_id = teams.id
      INNER JOIN nations ON teams.nation_id = nations.id
      WHERE nations.id = $1
      ORDER BY leagues.short_name`,
      [query.nationId],
    );
    return leaguesByNation;
  }

  async findOne(id: number): Promise<League> {
    const league = await this.leagueRepository
      .createQueryBuilder('league')
      .leftJoinAndSelect('league.logos', 'logos')
      .where('league.id = :id', { id: id })
      .orderBy('logos.start_year', 'ASC')
      .getOne();
    if (!league) {
      throw new NotFoundException(`League #${id} not found`);
    }
    return league;
  }

  async create(createLeagueDto: CreateLeagueDto): Promise<League> {
    const { logos, ...leagueData } = createLeagueDto;

    if (logos) {
      for (const logo of logos) {
        if (!logo.start_year) {
          throw new BadRequestException(
            'start_year is required for logos when creating a league',
          );
        }
      }
    }

    return await this.leagueRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const league = this.leagueRepository.create({
          ...leagueData,
        });
        const savedLeague = await transactionalEntityManager.save(league);

        if (logos && logos.length > 0) {
          const logoEntities = logos.map((logo) =>
            this.leagueLogoRepository.create({
              logo: logo.logo,
              start_year: logo.start_year!,
              end_year: logo.end_year,
              league: savedLeague,
              league_id: savedLeague.id,
            }),
          );
          savedLeague.logos =
            await transactionalEntityManager.save(logoEntities);
        } else {
          savedLeague.logos = [];
        }

        return savedLeague;
      },
    );
  }

  async update(id: number, updateLeagueDto: UpdateLeagueDto): Promise<League> {
    const { logos, ...leagueData } = updateLeagueDto;

    return await this.leagueRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const league = await transactionalEntityManager.findOne(League, {
          where: { id },
          relations: ['logos'],
        });

        if (!league) {
          throw new NotFoundException(`League with ID ${id} not found`);
        }

        Object.assign(league, leagueData);
        const updatedLeague = await transactionalEntityManager.save(
          League,
          league,
        );

        if (logos && logos.length > 0) {
          const incomingLogoIds = logos
            .filter((logo) => logo.id !== undefined)
            .map((logo) => logo.id!);
          await transactionalEntityManager.delete(LeagueLogo, {
            league: { id },
            id:
              incomingLogoIds.length > 0 ? Not(In(incomingLogoIds)) : undefined,
          });

          const logoEntities = logos.map((logoDto) => {
            const logoEntity = logoDto.id
              ? transactionalEntityManager.create(LeagueLogo, {
                  id: logoDto.id,
                  logo: logoDto.logo,
                  start_year: logoDto.start_year,
                  end_year: logoDto.end_year,
                  league: updatedLeague,
                  league_id: updatedLeague.id,
                })
              : transactionalEntityManager.create(LeagueLogo, {
                  logo: logoDto.logo,
                  start_year: logoDto.start_year,
                  end_year: logoDto.end_year,
                  league: updatedLeague,
                  league_id: updatedLeague.id,
                });
            return logoEntity;
          });

          await transactionalEntityManager.save(LeagueLogo, logoEntities);

          updatedLeague.logos = await transactionalEntityManager.find(
            LeagueLogo,
            {
              where: { league: { id } },
            },
          );
        } else if (logos && logos.length === 0) {
          await transactionalEntityManager.delete(LeagueLogo, {
            league: { id },
          });
          updatedLeague.logos = [];
        }

        return updatedLeague;
      },
    );
  }

  async remove(id: number): Promise<League> {
    const league = await this.findOne(id);
    return this.leagueRepository.remove(league);
  }
}
