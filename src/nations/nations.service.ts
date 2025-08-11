import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nation } from './entities/nation.entity';
import { Repository } from 'typeorm';
import { CreateNationDto } from './dto/create-nation.dto';
import { UpdateNationDto } from './dto/update-nation.dto';

@Injectable()
export class NationsService {
  constructor(
    @InjectRepository(Nation)
    private readonly nationRepository: Repository<Nation>,
  ) {}

  findAll(): Promise<Nation[]> {
    return this.nationRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Nation> {
    const nation = await this.nationRepository.findOne({
      where: { id },
    });
    if (!nation) {
      throw new NotFoundException(`Nation #${id} not found`);
    }
    return nation;
  }

  create(createNationDto: CreateNationDto): Promise<Nation> {
    const nation = this.nationRepository.create(createNationDto);
    return this.nationRepository.save(nation);
  }

  async update(id: number, updateNationDto: UpdateNationDto): Promise<Nation> {
    const nation = await this.nationRepository.preload({
      id: +id,
      ...updateNationDto,
    });
    if (!nation) {
      throw new NotFoundException(`Nation #${id} not found`);
    }
    return this.nationRepository.save(nation);
  }

  async remove(id: number): Promise<Nation> {
    const nation = await this.findOne(id);
    return this.nationRepository.remove(nation);
  }
}
