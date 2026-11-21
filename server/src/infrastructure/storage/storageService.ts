import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ENV } from '../../config/env.js';

export interface StoredFile {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  storageKey: string;
  downloadUrl: string;
  uploadedAt: Date;
  cloudUrl?: string | null;
}

export class StorageService {
  private inMemoryFiles: Map<string, StoredFile> = new Map();
  private s3Client: S3Client | null = null;

  constructor() {
    if (this.isS3Configured()) {
      try {
        this.s3Client = new S3Client({
          endpoint: ENV.S3_ENDPOINT || undefined,
          region: ENV.S3_REGION || 'auto',
          credentials: {
            accessKeyId: ENV.S3_ACCESS_KEY_ID,
            secretAccessKey: ENV.S3_SECRET_ACCESS_KEY,
          },
          forcePathStyle: true,
        });
      } catch (err) {
        console.warn('[STORAGE] S3 Client initialization deferred:', err);
      }
    }
  }

  public isS3Configured(): boolean {
    return Boolean(ENV.S3_BUCKET && ENV.S3_ACCESS_KEY_ID && ENV.S3_SECRET_ACCESS_KEY);
  }

  public isCloudConfigured(): boolean {
    return this.isS3Configured() || Boolean(ENV.GCS_BUCKET);
  }

  public async uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<StoredFile> {
    const fileId = uuidv4();
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storageKey = `uploads/${fileId}-${sanitizedName}`;

    let cloudUrl: string | null = null;

    // Upload to S3 if configured
    if (this.s3Client && ENV.S3_BUCKET) {
      try {
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: ENV.S3_BUCKET,
            Key: storageKey,
            Body: fileBuffer,
            ContentType: mimeType,
          })
        );
        cloudUrl = ENV.S3_ENDPOINT 
          ? `${ENV.S3_ENDPOINT.replace(/\/+$/, '')}/${ENV.S3_BUCKET}/${storageKey}`
          : `https://${ENV.S3_BUCKET}.s3.amazonaws.com/${storageKey}`;
      } catch (err) {
        console.warn('[STORAGE] S3 upload error, preserving in authoritative store:', err);
      }
    }

    const downloadUrl = `/api/v1/files/download/${fileId}`;

    const record: StoredFile = {
      id: fileId,
      originalName,
      mimeType,
      sizeBytes: fileBuffer.length,
      storageKey,
      downloadUrl,
      cloudUrl,
      uploadedAt: new Date(),
    };

    this.inMemoryFiles.set(fileId, record);
    return record;
  }

  public getFile(fileId: string): StoredFile | undefined {
    return this.inMemoryFiles.get(fileId);
  }
}

export const storageService = new StorageService();
