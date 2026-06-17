import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerPostseason } from './entities/player-postseason.entity';
import { CreatePlayerPostseasonDto } from './dto/create-player-postseason.dto';
import { UpdatePlayerPostseasonDto } from './dto/update-player-postseason.dto';

@Injectable()
export class PlayersPostseasonService {
  constructor(
    @InjectRepository(PlayerPostseason)
    private readonly playerPostseasonRepository: Repository<PlayerPostseason>,
  ) {}

  findAll() {
    return this.playerPostseasonRepository.find();
  }

  async findOne(id: number) {
    const playerPostseason = await this.playerPostseasonRepository.findOne({
      where: { id },
    });
    if (!playerPostseason) {
      throw new NotFoundException(`Player Postseason #${id} not found`);
    }
    return playerPostseason;
  }

  create(createPlayerPostseasonDto: CreatePlayerPostseasonDto) {
    const playerPostseason = this.playerPostseasonRepository.create(
      createPlayerPostseasonDto,
    );
    return this.playerPostseasonRepository.save(playerPostseason);
  }

  async update(
    id: number,
    updatePlayerPostseasonDto: UpdatePlayerPostseasonDto,
  ) {
    const playerPostseason = await this.playerPostseasonRepository.preload({
      id: id,
      ...updatePlayerPostseasonDto,
    });
    if (!playerPostseason) {
      throw new NotFoundException(`Player Postseason #${id} not found`);
    }
    return this.playerPostseasonRepository.save(playerPostseason);
  }

  async remove(id: number) {
    const playerPostseason = await this.findOne(id);
    return this.playerPostseasonRepository.remove(playerPostseason);
  }
}
