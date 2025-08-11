import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeaguesModule } from './leagues/leagues.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeagueLogosModule } from './league-logos/league-logos.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // validationSchema: Joi.object({
      //   DATABASE_HOST: Joi.required(),
      //   DATABASE_PORT: Joi.number().default(5432),
      //   DATABASE_USER: Joi.required(),
      //   DATABASE_PASSWORD: Joi.required(),
      //   DATABASE_NAME: Joi.required(),
      // }),
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    // serverless works only with env (I don't now why...)
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.DATABASE_HOST,
    //   port: +process.env.DATABASE_PORT,
    //   username: process.env.DATABASE_USER,
    //   password: process.env.DATABASE_PASSWORD,
    //   database: process.env.DATABASE_NAME,
    //   autoLoadEntities: true,
    //   synchronize: false,
    //   ssl: true,
    //   logging: ['query'],
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        ssl: true,
        autoLoadEntities: true,
        synchronize: false,
        logging: ['query'],
      }),
    }),
    LeaguesModule,
    LeagueLogosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
