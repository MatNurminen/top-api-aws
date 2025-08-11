import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [ConfigModule.forRoot(), MulterModule.register({})],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
