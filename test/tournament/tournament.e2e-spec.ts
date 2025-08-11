import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '../../src/config/config.service';
import { CreateTournamentDto } from '../../src/tournaments/dto/create-tournament.dto';
import { TournamentsModule } from '../../src/tournaments/tournaments.module';
import { UpdateTournamentDto } from '../../src/tournaments/dto/update-tournament.dto';

describe('[Feature] tournaments - /tournaments', () => {
  const tournament: CreateTournamentDto = {
    season_id: 2024,
    league_id: 2,
  };
  let expectedTournament = {};
  const updateTournament = { season_id: 2022 };
  let createdId: number;

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TournamentsModule,
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  it('Create [POST /] - success', async () => {
    return request(app.getHttpServer())
      .post('/tournaments')
      .send(tournament)
      .expect(HttpStatus.CREATED)
      .then(({ body }: request.Response) => {
        createdId = body.id;
        expectedTournament = expect.objectContaining({ ...tournament });
        expect(body).toEqual(expectedTournament);
        expectedTournament = { ...body };
      });
  });

  it('Get all [GET /]', () => {
    return request(app.getHttpServer())
      .get('/tournaments')
      .expect(HttpStatus.OK);
  });

  it('Get one [GET /:id]', async () => {
    return request(app.getHttpServer())
      .get(`/tournaments/${createdId}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.league_id).toBe(tournament.league_id);
      });
  });

  it('Update one [PATCH /:id]', async () => {
    const { body } = await request(app.getHttpServer())
      .patch(`/tournaments/${createdId}`)
      .send(updateTournament as UpdateTournamentDto)
      .expect(HttpStatus.OK);
    const updatedTournament = { ...expectedTournament, ...updateTournament };
    expect(body).toEqual(updatedTournament);
  });

  it('Delete one [DELETE /:id]', () => {
    return request(app.getHttpServer())
      .delete(`/tournaments/${createdId}`)
      .expect(200);
  });

  it('Get one [GET /:id] - fail after deleted the team', () => {
    return request(app.getHttpServer())
      .get(`/tournaments/${createdId}`)
      .expect(404);
  });

  it('Delete one [DELETE /:id] -fail after deleted the team', () => {
    return request(app.getHttpServer())
      .delete(`/tournaments/${createdId}`)
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
