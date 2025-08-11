import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  BadRequestException,
  Body,
  Logger,
  Delete,
  Get,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadCFService } from './cloudflare.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('upload-cf')
export class UploadCFController {
  private readonly logger = new Logger(UploadCFController.name);
  constructor(private readonly uploadService: UploadCFService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') subfolder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    this.logger.log(`Received file: ${file.originalname}`);
    return this.uploadService.uploadStream(file, subfolder);
  }

  @Delete()
  async deleteImage(@Query('key') key: string) {
    if (!key) {
      throw new BadRequestException('Missing "key" query parameter');
    }

    return this.uploadService.deleteFile(key);
  }

  @Post('folder')
  async createFolder(@Query('folder') subfolder: string) {
    if (!subfolder) {
      throw new BadRequestException('Missing "subfolder" query parameter');
    }

    return this.uploadService.createFolder(subfolder);
  }

  @Post('move')
  async moveFile(
    @Body()
    body: {
      fromKey: string;
      toKey: string;
    },
  ) {
    const { fromKey, toKey } = body;

    if (!fromKey || !toKey) {
      throw new BadRequestException('Both "fromKey" and "toKey" are required');
    }

    return this.uploadService.moveFile(fromKey, toKey);
  }

  @Delete('tmp')
  async deleteTmpFolderContents() {
    return this.uploadService.deleteAllFromTmp();
  }

  @Get('folders/:parentFolder')
  async listFolders(@Param('parentFolder') parentFolder: string) {
    return this.uploadService.listSubfolders(parentFolder);
  }
}
