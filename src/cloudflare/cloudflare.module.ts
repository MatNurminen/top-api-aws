import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadCFController } from './cloudflare.contoroller';
import { UploadCFService } from './cloudflare.service';

@Module({
  imports: [ConfigModule],
  controllers: [UploadCFController],
  providers: [UploadCFService],
})
export class UploadCFModule {}
