import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Season } from './entities/season.entity';
import { Repository } from 'typeorm';
import { CreateSeasonDto } from './dto/create-season.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';

@Injectable()
export class SeasonsService {
  constructor(
    @InjectRepository(Season)
    private readonly seasonRepository: Repository<Season>,
  ) {}

  findAll(): Promise<Season[]> {
    return this.seasonRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Season> {
    const season = await this.seasonRepository.findOne({
      where: { id },
    });
    if (!season) {
      throw new NotFoundException(`Season #${id} not found`);
    }
    return season;
  }

  create(createSeasonDto: CreateSeasonDto): Promise<Season> {
    const season = this.seasonRepository.create(createSeasonDto);
    return this.seasonRepository.save(season);
  }

  async update(id: number, updateSeasonDto: UpdateSeasonDto): Promise<Season> {
    const season = await this.seasonRepository.preload({
      id: id,
      ...updateSeasonDto,
    });
    if (!season) {
      throw new NotFoundException(`Season #${id} not found`);
    }
    return this.seasonRepository.save(season);
  }

  async remove(id: number): Promise<Season> {
    const season = await this.findOne(id);
    return this.seasonRepository.remove(season);
  }
}
