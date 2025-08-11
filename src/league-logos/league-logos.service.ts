import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LeagueLogo } from './entities/league-logo.entity';
import { Repository } from 'typeorm';
import { CreateLeagueLogoDto } from './dto/create-league-logo.dto';
import { UpdateLeagueLogoDto } from './dto/update-league-logo.dto';

@Injectable()
export class LeagueLogosService {
  constructor(
    @InjectRepository(LeagueLogo)
    private readonly leagueLogoRepository: Repository<LeagueLogo>,
  ) {}

  findAll() {
    return this.leagueLogoRepository.find();
  }

  async findOne(id: number) {
    const leagueLogo = await this.leagueLogoRepository.findOne({
      where: { id },
    });
    if (!leagueLogo) {
      throw new NotFoundException(`League Logo #${id} not found`);
    }
    return leagueLogo;
  }

  create(createLeagueLogoDto: CreateLeagueLogoDto) {
    const leagueLogo = this.leagueLogoRepository.create(createLeagueLogoDto);
    return this.leagueLogoRepository.save(leagueLogo);
  }

  async update(id: number, updateLeagueLogoDto: UpdateLeagueLogoDto) {
    const leagueLogo = await this.leagueLogoRepository.preload({
      id: id,
      ...updateLeagueLogoDto,
    });
    if (!leagueLogo) {
      throw new NotFoundException(`League Logo #${id} not found`);
    }
    return this.leagueLogoRepository.save(leagueLogo);
  }

  async remove(id: number) {
    const leagueLogo = await this.findOne(id);
    return this.leagueLogoRepository.remove(leagueLogo);
  }
}
