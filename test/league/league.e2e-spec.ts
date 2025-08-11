import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { LeaguesModule } from '../../src/leagues/leagues.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateLeagueDto } from '../../src/leagues/dto/create-league.dto';
import { UpdateLeagueDto } from '../../src/leagues/dto/update-league.dto';
import { configService } from '../../src/config/config.service';

describe('[Feature] leagues - /leagues', () => {
  const league: CreateLeagueDto = {
    name: 'Test League',
    color: '#ffffff',
    short_name: 'TLG',
    start_year: 2012,
    type_id: 1,
  };
  let expectedLeague = {};
  const updateLeague = { short_name: 'WWW', end_year: 2020 };
  let createdId: number;
  const next_year: number = new Date().getFullYear() + 1;

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        LeaguesModule,
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
      .post('/leagues')
      .send(league)
      .expect(HttpStatus.CREATED)
      .then(({ body }: request.Response) => {
        createdId = body.id;
        expectedLeague = expect.objectContaining({ ...league });
        expect(body).toEqual(expectedLeague);
        expectedLeague = { ...body };
      });
  });

  it('Create [POST /] - fail', async () => {
    return request(app.getHttpServer())
      .post('/leagues')
      .send({ ...league, start_year: next_year })
      .expect(400);
  });

  it('Get all [GET /]', () => {
    return request(app.getHttpServer()).get('/leagues').expect(HttpStatus.OK);
  });

  it('Get one [GET /:id]', async () => {
    return request(app.getHttpServer())
      .get(`/leagues/${createdId}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.name).toBe(league.name);
      });
  });

  it('Update one [PATCH /:id]', async () => {
    const { body } = await request(app.getHttpServer())
      .patch(`/leagues/${createdId}`)
      .send(updateLeague as UpdateLeagueDto)
      .expect(HttpStatus.OK);
    const updatedLeague = { ...expectedLeague, ...updateLeague };
    expect(body).toEqual(updatedLeague);
  });

  it('Delete one [DELETE /:id]', () => {
    return request(app.getHttpServer())
      .delete(`/leagues/${createdId}`)
      .expect(200);
  });

  it('Get one [GET /:id] after delete the league', () => {
    return request(app.getHttpServer())
      .get(`/leagues/${createdId}`)
      .expect(404);
  });

  it('Delete one [DELETE /:id] after delete the league', () => {
    return request(app.getHttpServer())
      .delete(`/leagues/${createdId}`)
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
