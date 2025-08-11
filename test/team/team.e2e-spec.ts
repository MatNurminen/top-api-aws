import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TeamsModule } from '../../src/teams/teams.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateTeamDto } from '../../src/teams/dto/create-team.dto';
import { UpdateTeamDto } from '../../src/teams/dto/update-team.dto';
import { configService } from '../../src/config/config.service';

describe('[Feature] teams - /teams', () => {
  const team: CreateTeamDto = {
    full_name: 'Test Team',
    name: 'Test',
    short_name: 'TTT',
    start_year: 2012,
    nation_id: 2,
  };
  let expectedTeam = {};
  const updateTeam = { full_name: 'New Test Team', end_year: 2020 };
  let createdId: number;
  const next_year: number = new Date().getFullYear() + 1;

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TeamsModule,
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
      .post('/teams')
      .send(team)
      .expect(HttpStatus.CREATED)
      .then(({ body }: request.Response) => {
        createdId = body.id;
        expectedTeam = expect.objectContaining({ ...team });
        expect(body).toEqual(expectedTeam);
        expectedTeam = { ...body };
      });
  });

  it('Create [POST /] - fail', async () => {
    return request(app.getHttpServer())
      .post('/teams')
      .send({ ...team, start_year: next_year })
      .expect(400);
  });

  it('Get all [GET /]', () => {
    return request(app.getHttpServer()).get('/teams').expect(HttpStatus.OK);
  });

  it('Get one [GET /:id]', async () => {
    return request(app.getHttpServer())
      .get(`/teams/${createdId}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.full_name).toBe(team.full_name);
      });
  });

  it('Update one [PATCH /:id]', async () => {
    const { body } = await request(app.getHttpServer())
      .patch(`/teams/${createdId}`)
      .send(updateTeam as UpdateTeamDto)
      .expect(HttpStatus.OK);
    const updatedTeam = { ...expectedTeam, ...updateTeam };
    expect(body).toEqual(updatedTeam);
  });

  it('Delete one [DELETE /:id]', () => {
    return request(app.getHttpServer())
      .delete(`/teams/${createdId}`)
      .expect(200);
  });

  it('Get one [GET /:id] - fail after deleted the team', () => {
    return request(app.getHttpServer()).get(`/teams/${createdId}`).expect(404);
  });

  it('Delete one [DELETE /:id] -fail after deleted the team', () => {
    return request(app.getHttpServer())
      .delete(`/teams/${createdId}`)
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
