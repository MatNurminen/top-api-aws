import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import axios from 'axios';

@Injectable()
export class UploadService {
  private readonly root_folder: string;
  private readonly logger = new Logger(UploadService.name);

  constructor(private configService: ConfigService) {
    this.root_folder = this.configService.get<string>('CLOUDINARY_ROOT_FOLDER');
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
    this.logger.log(`Cloudinary configured for folder: ${this.root_folder}`);
  }

  private validateFolderName(folderName: string): void {
    if (!/^[a-zA-Z0-9-_]+$/.test(folderName)) {
      throw new BadRequestException(
        'Invalid folder name. Use only alphanumeric characters, hyphens, or underscores.',
      );
    }
  }

  async checkSubfolder(subfolder: string): Promise<boolean> {
    try {
      this.validateFolderName(subfolder);
      this.logger.debug(`Checking subfolder existence: ${subfolder}`);
      const result = await cloudinary.api.sub_folders(this.root_folder);
      const subfolders = result.folders.map((folder: any) => folder.name);
      this.logger.debug(`Existing subfolders: ${subfolders.join(', ')}`);
      return subfolders.includes(subfolder);
    } catch (error) {
      this.logger.error(`Subfolder check failed: ${error.message}`);
      throw new BadRequestException(
        `Failed to check subfolder: ${error.message}`,
      );
    }
  }

  async uploadStream(
    file: Express.Multer.File,
    subfolder?: string,
  ): Promise<any> {
    const filename = path.parse(file.originalname).name;

    this.logger.log(
      `Starting upload for: ${filename} to ${subfolder || 'root'}`,
    );

    if (subfolder) {
      this.validateFolderName(subfolder);
      if (subfolder !== 'tmp' && !(await this.checkSubfolder(subfolder))) {
        throw new BadRequestException(
          `Subfolder '${subfolder}' does not exist.`,
        );
      }
    }

    const folder = subfolder
      ? `${this.root_folder}/${subfolder}`
      : this.root_folder;
    const publicId = filename;

    this.logger.debug(`Upload params: folder=${folder}, public_id=${publicId}`);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, public_id: publicId, overwrite: true },
        (error, result) => {
          if (error) {
            this.logger.error(`Upload failed: ${error.message}`);
            reject(error);
          } else {
            this.logger.log(`Upload success: ${result.secure_url}`);
            resolve(result);
          }
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFolder(
    folderName: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      this.logger.log(`Starting folder deletion: ${folderName}`);
      this.validateFolderName(folderName);

      const fullFolderPath = `${this.root_folder}/${folderName}`;
      this.logger.debug(`Full folder path: ${fullFolderPath}`);

      const subfolders = await cloudinary.api.sub_folders(this.root_folder);
      const folderExists = subfolders.folders.some(
        (f: any) => f.name === folderName,
      );

      if (!folderExists) {
        this.logger.warn(`Folder ${folderName} doesn't exist`);
        return {
          success: false,
          message: `Folder ${folderName} doesn't exist`,
        };
      }

      this.logger.debug(`Deleting resources in: ${fullFolderPath}`);
      await cloudinary.api.delete_resources_by_prefix(fullFolderPath);

      this.logger.debug(`Deleting folder: ${fullFolderPath}`);
      await cloudinary.api.delete_folder(fullFolderPath);

      this.logger.log(`Folder ${folderName} deleted successfully`);
      return {
        success: true,
        message: `Folder ${folderName} successfully deleted`,
      };
    } catch (error) {
      this.logger.error(`Folder deletion failed: ${error.message}`);
      throw new BadRequestException(`Error deleting folder: ${error.message}`);
    }
  }

  async moveFromTmpToFolder(
    filename: string,
    destinationFolder: string,
  ): Promise<any> {
    this.logger.log(`Moving file ${filename} from tmp to ${destinationFolder}`);

    this.validateFolderName(destinationFolder);

    if (!(await this.checkSubfolder(destinationFolder))) {
      throw new BadRequestException(
        `Subfolder '${destinationFolder}' does not exist.`,
      );
    }

    const tmpPublicId = `${this.root_folder}/tmp/${filename}`;
    const destinationFolderPath = `${this.root_folder}/${destinationFolder}`;

    const tmpUrl = cloudinary.url(tmpPublicId, { secure: true });

    try {
      const response = await axios.get(tmpUrl, { responseType: 'arraybuffer' });

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: destinationFolderPath,
            public_id: filename,
            overwrite: true,
            eager: [
              { width: 100, crop: 'scale', format: 'png' },
              { width: 100, crop: 'scale', format: 'svg' },
            ],
          },
          (error, result) => {
            if (error) {
              this.logger.error(`Upload error: ${error.message}`);
              reject(error);
            } else {
              resolve(result);
            }
          },
        );

        streamifier.createReadStream(response.data).pipe(uploadStream);
      });

      await cloudinary.uploader.destroy(tmpPublicId);
      this.logger.log(`File moved to ${destinationFolderPath}/${filename}`);

      return uploadResult;
    } catch (error) {
      this.logger.error(`Failed to move file: ${error.message}`);
      throw new BadRequestException(`Failed to move file: ${error.message}`);
    }
  }
}
