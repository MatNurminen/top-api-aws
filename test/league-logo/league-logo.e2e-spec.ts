import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { LeagueLogosModule } from '../../src/league-logos/league-logos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateLeagueLogoDto } from '../../src/league-logos/dto/create-league-logo.dto';
import { UpdateLeagueLogoDto } from '../../src/league-logos/dto/update-league-logo.dto';
import { configService } from '../../src/config/config.service';

describe('[Feature] league-logos - /league-logos', () => {
  const leagueLogo: CreateLeagueLogoDto = {
    start_year: 2012,
    logo: '/img/liiga/logo.png',
    league_id: 2,
  };
  let expectedLeagueLogo = {};
  const updateLeagueLogo = { end_year: 2015, logo: '/img/liiga/newlogo.png' };
  let createdId: number;
  const next_year: number = new Date().getFullYear() + 1;

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        LeagueLogosModule,
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
      .post('/league-logos')
      .send(leagueLogo)
      .expect(HttpStatus.CREATED)
      .then(({ body }: request.Response) => {
        createdId = body.id;
        expectedLeagueLogo = expect.objectContaining({ ...leagueLogo });
        expect(body).toEqual(expectedLeagueLogo);
        expectedLeagueLogo = { ...body };
      });
  });

  it('Create [POST /] - fail', async () => {
    return request(app.getHttpServer())
      .post('/league-logos')
      .send({ ...leagueLogo, start_year: next_year })
      .expect(400);
  });

  it('Get all [GET /]', () => {
    return request(app.getHttpServer())
      .get('/league-logos')
      .expect(HttpStatus.OK);
  });

  it('Get one [GET /:id]', async () => {
    return request(app.getHttpServer())
      .get(`/league-logos/${createdId}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.logo).toBe(leagueLogo.logo);
      });
  });

  it('Update one [PATCH /:id]', async () => {
    const { body } = await request(app.getHttpServer())
      .patch(`/league-logos/${createdId}`)
      .send(updateLeagueLogo as UpdateLeagueLogoDto)
      .expect(HttpStatus.OK);
    const updatedLeague = { ...expectedLeagueLogo, ...updateLeagueLogo };
    expect(body).toEqual(updatedLeague);
  });

  it('Delete one [DELETE /:id]', () => {
    return request(app.getHttpServer())
      .delete(`/league-logos/${createdId}`)
      .expect(200);
  });

  it('Get one [GET /:id] after delete the league', () => {
    return request(app.getHttpServer())
      .get(`/league-logos/${createdId}`)
      .expect(404);
  });

  it('Delete one [DELETE /:id] after delete the league', () => {
    return request(app.getHttpServer())
      .delete(`/league-logos/${createdId}`)
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
