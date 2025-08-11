import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { NationsModule } from '../../src/nations/nations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '../../src/config/config.service';
import { CreateNationDto } from '../../src/nations/dto/create-nation.dto';
import { UpdateNationDto } from '../../src/nations/dto/update-nation.dto';

describe('[Feature] nations - /nations', () => {
  const nation: CreateNationDto = {
    name: 'Test Nation',
    short_name: 'TSN',
    flag: '/img/flags/test.svg',
    logo: '/img/flags/test.svg',
    color: '#fff',
  };
  let expectedNation = {};
  const updateNation = {
    name: 'New Test Nation',
    flag: '/img/flags/new.svg',
  };
  let createdId: number;

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        NationsModule,
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
      .post('/nations')
      .send(nation)
      .expect(HttpStatus.CREATED)
      .then(({ body }: request.Response) => {
        createdId = body.id;
        expectedNation = expect.objectContaining({ ...nation });
        expect(body).toEqual(expectedNation);
        expectedNation = { ...body };
      });
  });

  it('Create [POST /] - fail', async () => {
    return request(app.getHttpServer())
      .post('/nations')
      .send({ ...nation, color: 'color' })
      .expect(400)
      .then(({ body }: request.Response) => {
        expect(body['message'][0]).toEqual('color must be a hexadecimal color');
      });
  });

  it('Get all [GET /]', () => {
    return request(app.getHttpServer()).get('/nations').expect(HttpStatus.OK);
  });

  it('Get one [GET /:id]', async () => {
    return request(app.getHttpServer())
      .get(`/nations/${createdId}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.name).toBe(nation.name);
      });
  });

  it('Update one [PATCH /:id]', async () => {
    const { body } = await request(app.getHttpServer())
      .patch(`/nations/${createdId}`)
      .send(updateNation as UpdateNationDto)
      .expect(HttpStatus.OK);
    const updatedNation = { ...expectedNation, ...updateNation };
    expect(body).toEqual(updatedNation);
  });

  it('Delete one [DELETE /:id]', () => {
    return request(app.getHttpServer())
      .delete(`/nations/${createdId}`)
      .expect(200);
  });

  it('Get one [GET /:id] - fail after deleted the nation', () => {
    return request(app.getHttpServer())
      .get(`/nations/${createdId}`)
      .expect(404);
  });

  it('Delete one [DELETE /:id] -fail after deleted the nation', () => {
    return request(app.getHttpServer())
      .delete(`/nations/${createdId}`)
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
