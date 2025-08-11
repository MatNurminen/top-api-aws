import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamLogo } from './entities/team-logo.entity';
import { Repository } from 'typeorm';
import { CreateTeamLogoDto } from './dto/create-team-logo.dto';
import { UpdateTeamLogoDto } from './dto/update-team-logo.dto';

@Injectable()
export class TeamLogosService {
  constructor(
    @InjectRepository(TeamLogo)
    private readonly teamLogoRepository: Repository<TeamLogo>,
  ) {}

  findAll() {
    return this.teamLogoRepository.find();
  }

  async findOne(id: number) {
    const teamLogo = await this.teamLogoRepository.findOne({
      where: { id },
    });
    if (!teamLogo) {
      throw new NotFoundException(`Team Logo #${id} not found`);
    }
    return teamLogo;
  }

  create(createTeamLogoDto: CreateTeamLogoDto) {
    const teamLogo = this.teamLogoRepository.create(createTeamLogoDto);
    return this.teamLogoRepository.save(teamLogo);
  }

  async update(id: number, updateTeamLogoDto: UpdateTeamLogoDto) {
    const teamLogo = await this.teamLogoRepository.preload({
      id: id,
      ...updateTeamLogoDto,
    });
    if (!teamLogo) {
      throw new NotFoundException(`Team Logo #${id} not found`);
    }
    return this.teamLogoRepository.save(teamLogo);
  }

  async remove(id: number) {
    const teamLogo = await this.findOne(id);
    return this.teamLogoRepository.remove(teamLogo);
  }
}
