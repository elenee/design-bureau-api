import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class AwsS3Service {
  private bucketName;
  private s3;

  constructor() {
    this.bucketName = process.env.AWS_BUCKET_NAME;
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.aws_access_key!,
        secretAccessKey: process.env.aws_secret_access_key!,
      },
      region: process.env.AWS_REGION,
    });
  }

  async uploadFile(key, buffer) {
    if (!key || !buffer)
      throw new BadRequestException('Key and buffer is required fields');

    const config: any = {
      Key: key,
      Bucket: this.bucketName,
      Body: buffer,
      ContentType: 'image/jpeg',
    };

    const command = new PutObjectCommand(config);
    await this.s3.send(command);

    return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
  }

  async deleteFile(key) {
    if (!key) throw new BadRequestException();
    try {
      const config = {
        Key: key,
        Bucket: this.bucketName,
      };
      const command = new DeleteObjectCommand(config);
      await this.s3.send(command);
    } catch (error) {
      throw new BadRequestException("Couldn't delete file");
    }
  }
}
