import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(
    key: string,
    buffer: Buffer,
    mimetype: string,
  ): Promise<string> {
    if (!key || !buffer) {
      throw new BadRequestException('Key and buffer are required fields');
    }

    try {
      const publicId = key.replace(/\.[^/.]+$/, '');

      const result: UploadApiResponse = await new Promise(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              public_id: publicId,
              resource_type: 'image',
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result!);
              }
            },
          );

          uploadStream.end(buffer);
        },
      );

      return result.secure_url;
    } catch (error) {
      throw new BadRequestException("Couldn't upload file");
    }
  }

  async deleteFile(key: string): Promise<void> {
    if (!key) {
      throw new BadRequestException('File key is required');
    }

    try {
      const publicId = key.replace(/\.[^/.]+$/, '');

      await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
      });
    } catch (error) {
      throw new BadRequestException("Couldn't delete file");
    }
  }
}