import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Award } from './entities/award.entity';
import { CreateAwardDto } from './dto/create-award.dto';
import { League } from '../leagues/entities/league.entity';
import { validateEntityExists } from '../common/utils/entity-validator.util';
import { UpdateAwardDto } from './dto/update-award-logo.dto';

@Injectable()
export class AwardsService {
  constructor(
    @InjectRepository(Award)
    private readonly awardRepository: Repository<Award>,
    @InjectRepository(League)
    private readonly leagueRepository: Repository<League>,
  ) {}

  findAll(): Promise<Award[]> {
    return this.awardRepository.find();
  }

  async findOne(id: number): Promise<Award> {
    const award = await this.awardRepository.findOne({
      where: { id },
    });
    if (!award) {
      throw new NotFoundException(`Award #${id} not found`);
    }
    return award;
  }

  async create(createAwardDto: CreateAwardDto): Promise<Award> {
    const { league_id } = createAwardDto;

    await Promise.all([
      validateEntityExists(this.leagueRepository, League, league_id, 'League'),
    ]);

    const award = this.awardRepository.create(createAwardDto);
    return this.awardRepository.save(award);
  }

  async update(id: number, updateAwardDto: UpdateAwardDto): Promise<Award> {
    const award = await this.awardRepository.preload({
      id: id,
      ...updateAwardDto,
    });

    if (!award) {
      throw new NotFoundException(`Award #${id} not found`);
    }

    const savedAward = await this.awardRepository.save(award);
    return this.findOne(savedAward.id);
  }

  async remove(id: number): Promise<Award> {
    const award = await this.findOne(id);
    return this.awardRepository.remove(award);
  }
}
