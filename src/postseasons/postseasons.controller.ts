import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostseasonsService } from './postseasons.service';
import { Postseason } from './entities/postseason.entity';

@ApiTags('Postseasons')
@Controller('postseasons')
export class PostseasonsController {
  constructor(private readonly postseasonsService: PostseasonsService) {}

  @Get()
  findAll(): Promise<Postseason[]> {
    return this.postseasonsService.findAll();
  }
}
