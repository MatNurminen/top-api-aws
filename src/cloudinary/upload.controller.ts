import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
  Delete,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { MoveFileDto } from './dto/move-file-dto';
import { Timeout } from '../common/decorators/timeout.decorator';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: UploadService) {}

  @Post()
  @Timeout(12000)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') subfolder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const result = await this.cloudinaryService.uploadStream(file, subfolder);
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  @Delete('tmp')
  async deleteTmpFolder() {
    return this.cloudinaryService.deleteFolder('tmp');
  }

  @Post('move')
  @Timeout(12000)
  async moveFileFromTmp(@Body() body: MoveFileDto) {
    const result = await this.cloudinaryService.moveFromTmpToFolder(
      body.filename,
      body.destinationFolder,
    );
    return {
      url: result.eager?.[0]?.secure_url ?? result.secure_url,
      public_id: result.public_id,
    };
  }
}
