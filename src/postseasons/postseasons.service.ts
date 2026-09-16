import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Postseason } from './entities/postseason.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostseasonsService {
  constructor(
    @InjectRepository(Postseason)
    private readonly postseasonRepository: Repository<Postseason>,
  ) {}

  findAll(): Promise<Postseason[]> {
    return this.postseasonRepository.find({
      relations: ['teamTournaments'],
    });
  }
}
