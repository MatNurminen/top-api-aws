import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamPostseason } from './entities/teams-postseason.entity';
import { CreateTeamPostseasonDto } from './dto/create-team-postseason.dto';
import { UpdateTeamPostseasonDto } from './dto/update-team-postseason.dto';

@Injectable()
export class TeamsPostseasonService {
  constructor(
    @InjectRepository(TeamPostseason)
    private readonly teamPostseasonRepository: Repository<TeamPostseason>,
  ) {}

  findAll() {
    return this.teamPostseasonRepository.find();
  }

  async findOne(id: number) {
    const teamPostseason = await this.teamPostseasonRepository.findOne({
      where: { id },
    });
    if (!teamPostseason) {
      throw new NotFoundException(`Team Postseason #${id} not found`);
    }
    return teamPostseason;
  }

  create(createTeamPostseasonDto: CreateTeamPostseasonDto) {
    const teamPostseason = this.teamPostseasonRepository.create(
      createTeamPostseasonDto,
    );
    return this.teamPostseasonRepository.save(teamPostseason);
  }

  async update(
    id: number,
    updateTeamPostseasonDto: UpdateTeamPostseasonDto,
  ) {
    const teamPostseason = await this.teamPostseasonRepository.preload({
      id: id,
      ...updateTeamPostseasonDto,
    });
    if (!teamPostseason) {
      throw new NotFoundException(`Team Postseason #${id} not found`);
    }
    return this.teamPostseasonRepository.save(teamPostseason);
  }

  async remove(id: number) {
    const teamPostseason = await this.findOne(id);
    return this.teamPostseasonRepository.remove(teamPostseason);
  }
}
