import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerTournament } from './entities/player-tournament.entity';
import { Repository } from 'typeorm';
import { CreatePlayerTournamentDto } from './dto/create-player-tournament.dto';
import { validateEntityExists } from '../common/utils/entity-validator.util';
import { TeamTournament } from '../teams-tournaments/entities/team-tournament.entity';
import { Player } from '../players/entities/player.entity';
import { UpdatePlayerTournamentDto } from './dto/update-player-tournament.dto';

@Injectable()
export class PlayersTournamentsService {
  constructor(
    @InjectRepository(PlayerTournament)
    private readonly playerTournamentRepository: Repository<PlayerTournament>,
    @InjectRepository(TeamTournament)
    private readonly teamTournamentRepository: Repository<TeamTournament>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async findOne(id: number): Promise<PlayerTournament> {
    const playerTournament = await this.playerTournamentRepository.findOne({
      where: { id },
    });
    if (!playerTournament) {
      throw new NotFoundException(`Season #${id} not found`);
    }
    return playerTournament;
  }

  async create(
    createPlayerTournamentDto: CreatePlayerTournamentDto,
  ): Promise<PlayerTournament> {
    const { teams_tournament_id, player_id } = createPlayerTournamentDto;

    await Promise.all([
      validateEntityExists(
        this.teamTournamentRepository,
        TeamTournament,
        teams_tournament_id,
        'TeamTournament',
      ),
      validateEntityExists(this.playerRepository, Player, player_id, 'Player'),
    ]);

    const playerTournament = this.playerTournamentRepository.create(
      createPlayerTournamentDto,
    );
    return this.playerTournamentRepository.save(playerTournament);
  }

  async update(
    id: number,
    updatePlayerTournamentDto: UpdatePlayerTournamentDto,
  ): Promise<PlayerTournament> {
    const playerTournament = await this.playerTournamentRepository.preload({
      id: id,
      ...updatePlayerTournamentDto,
    });

    if (!playerTournament) {
      throw new NotFoundException(`Player Tournament #${id} not found`);
    }

    const savedPlayerTournament =
      await this.playerTournamentRepository.save(playerTournament);
    return this.findOne(savedPlayerTournament.id);
  }

  async remove(id: number): Promise<PlayerTournament> {
    const playerTournament = await this.findOne(id);
    return this.playerTournamentRepository.remove(playerTournament);
  }
}
