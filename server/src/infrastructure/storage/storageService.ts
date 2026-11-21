import { v4 as uuidv4 } from 'uuid';
import { ENV } from '../../config/env.js';

export interface StoredFile {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  storageKey: string;
  downloadUrl: string;
  uploadedAt: Date;
}

export class StorageService {
  private inMemoryFiles: Map<string, StoredFile> = new Map();

  public isCloudConfigured(): boolean {
    return Boolean(ENV.GCS_BUCKET);
  }

  public async uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<StoredFile> {
    const fileId = uuidv4();
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storageKey = `uploads/${fileId}-${sanitizedName}`;

    // Generate signed / access URL
    const downloadUrl = `/api/v1/files/download/${fileId}`;

    const record: StoredFile = {
      id: fileId,
      originalName,
      mimeType,
      sizeBytes: fileBuffer.length,
      storageKey,
      downloadUrl,
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
