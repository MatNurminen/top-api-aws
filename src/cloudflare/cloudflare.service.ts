import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  CopyObjectCommand,
  ObjectIdentifier,
  DeleteObjectsCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

@Injectable()
export class UploadCFService {
  private readonly bucketName: string;
  private readonly rootFolder: string;
  private readonly s3Client: S3Client;
  private readonly logger = new Logger(UploadCFService.name);

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('CLOUDFLARE_BUCKET_NAME');
    this.rootFolder = this.configService.get<string>('CLOUDFLARE_ROOT_FOLDER');
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: this.configService.get<string>('CLOUDFLARE_R2_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get<string>('CLOUDFLARE_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'CLOUDFLARE_SECRET_ACCESS_KEY',
        ),
      },
    });
    this.logger.log(`R2 client configured for bucket: ${this.bucketName}`);
  }

  private validateFolderName(folderName: string): void {
    if (!/^[a-zA-Z0-9-_/]+$/.test(folderName)) {
      throw new BadRequestException(
        'Invalid folder name. Use only alphanumeric characters, hyphens, or underscores.',
      );
    }
  }

  async checkSubfolder(subfolder: string): Promise<boolean> {
    this.validateFolderName(subfolder);
    const prefix = `${this.rootFolder}/${subfolder}/`;

    try {
      const result = await this.s3Client.send(
        new ListObjectsV2Command({
          Bucket: this.bucketName,
          Prefix: prefix,
          MaxKeys: 1,
        }),
      );

      const exists = result.Contents && result.Contents.length > 0;
      this.logger.debug(`Subfolder '${subfolder}' exists: ${exists}`);
      return exists;
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
  ): Promise<{ url: string; key: string }> {
    const filename = path.parse(file.originalname).name;
    const extension = path.extname(file.originalname);
    const keyPrefix = subfolder
      ? `${this.rootFolder}/${subfolder}`
      : this.rootFolder;

    if (subfolder) {
      this.validateFolderName(subfolder);
      if (subfolder !== 'tmp' && !(await this.checkSubfolder(subfolder))) {
        throw new BadRequestException(
          `Subfolder '${subfolder}' does not exist.`,
        );
      }
    }

    const key = `${keyPrefix}/${filename}${extension}`;

    this.logger.debug(`Uploading file to R2: ${key}`);

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      const url = `${this.configService.get<string>('CLOUDFLARE_PUBLIC_URL')}/${key}`;
      this.logger.log(`Upload successful: ${url}`);
      return { url, key };
    } catch (error) {
      this.logger.error(`Upload failed: ${error.message}`);
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  async deleteFile(key: string): Promise<{ deleted: boolean; key: string }> {
    this.logger.debug(`Deleting file from R2: ${key}`);

    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );

      this.logger.log(`Deleted file: ${key}`);
      return { deleted: true, key };
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
      throw new BadRequestException(`Failed to delete file: ${error.message}`);
    }
  }

  async createFolder(
    subfolder: string,
  ): Promise<{ created: boolean; key: string }> {
    this.validateFolderName(subfolder);

    const key = `${this.rootFolder}/${subfolder}/.keep`;

    this.logger.debug(`Creating folder: ${key}`);

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: '',
          ContentType: 'text/plain',
        }),
      );

      this.logger.log(`Folder created: ${subfolder}`);
      return { created: true, key };
    } catch (error) {
      this.logger.error(`Failed to create folder: ${error.message}`);
      throw new BadRequestException(
        `Failed to create folder: ${error.message}`,
      );
    }
  }

  async moveFile(
    fromKey: string,
    toKey: string,
  ): Promise<{ message: string; key: string }> {
    const fullDestinationPath = path.dirname(toKey);
    const relativeDestinationPath = fullDestinationPath.replace(
      `${this.rootFolder}/`,
      '',
    );

    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: fromKey,
        }),
      );
    } catch (err) {
      if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
        return {
          message: `File '${fromKey}' does not exist, skipping move.`,
          key: fromKey,
        };
      }
      throw err;
    }

    if (
      !fromKey.includes('tmp/') &&
      !(await this.checkSubfolder(relativeDestinationPath))
    ) {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: fromKey,
        }),
      );

      return {
        message: `Folder '${fullDestinationPath}' does not exist. File removed from source.`,
        key: fromKey,
      };
    }

    await this.s3Client.send(
      new CopyObjectCommand({
        Bucket: this.bucketName,
        CopySource: `/${this.bucketName}/${fromKey}`,
        Key: toKey,
      }),
    );

    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fromKey,
      }),
    );

    return {
      message: 'File moved successfully',
      key: toKey,
    };
  }

  async deleteAllFromTmp(): Promise<{ deletedCount: number }> {
    const prefix = `${this.rootFolder}/tmp/`;

    try {
      const listedObjects = await this.s3Client.send(
        new ListObjectsV2Command({
          Bucket: this.bucketName,
          Prefix: prefix,
        }),
      );

      if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        this.logger.log('No files to delete in tmp folder.');
        return { deletedCount: 0 };
      }

      const objectsToDelete: ObjectIdentifier[] = listedObjects.Contents.map(
        (item) => ({ Key: item.Key }),
      );

      await this.s3Client.send(
        new DeleteObjectsCommand({
          Bucket: this.bucketName,
          Delete: { Objects: objectsToDelete },
        }),
      );

      this.logger.log(
        `Deleted ${objectsToDelete.length} file(s) from tmp folder.`,
      );
      return { deletedCount: objectsToDelete.length };
    } catch (error) {
      this.logger.error(
        `Failed to delete tmp folder contents: ${error.message}`,
      );
      throw new BadRequestException(
        `Failed to delete tmp folder: ${error.message}`,
      );
    }
  }

  async listSubfolders(parentFolder: string): Promise<string[]> {
    this.validateFolderName(parentFolder);
    const prefix = `${this.rootFolder}/${parentFolder}/`;

    try {
      const result = await this.s3Client.send(
        new ListObjectsV2Command({
          Bucket: this.bucketName,
          Prefix: prefix,
          Delimiter: '/',
        }),
      );

      if (!result.CommonPrefixes) {
        this.logger.debug(`No subfolders found in '${parentFolder}'`);
        return [];
      }

      const subfolders = result.CommonPrefixes.map((commonPrefix) => {
        const fullPath = commonPrefix.Prefix || '';
        const relativePath = fullPath.replace(prefix, '');
        return relativePath.replace('/', '');
      }).filter(Boolean);

      this.logger.debug(
        `Found subfolders in '${parentFolder}': ${subfolders.join(', ')}`,
      );
      return subfolders;
    } catch (error) {
      this.logger.error(`Failed to list subfolders: ${error.message}`);
      throw new BadRequestException(
        `Failed to list subfolders: ${error.message}`,
      );
    }
  }
}
