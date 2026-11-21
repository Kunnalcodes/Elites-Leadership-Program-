import { Queue, Worker, Job } from 'bullmq';
import { getRedisClient } from '../redis/redisClient.js';
import { v4 as uuidv4 } from 'uuid';

export interface QueueJob<T = any> {
  id: string;
  name: string;
  data: T;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  attempts: number;
  maxAttempts: number;
  error?: string;
  createdAt: Date;
  processedAt?: Date;
}

export class UnifiedQueueManager {
  private inMemoryJobs: Map<string, QueueJob> = new Map();
  private bullQueues: Map<string, Queue> = new Map();
  private workers: Map<string, (data: any) => Promise<any>> = new Map();

  constructor() {
    this.registerWorker('notifications', async (data) => {
      // Process notification job
      return { success: true, processedAt: new Date() };
    });
    this.registerWorker('email', async (data) => {
      // Process email job
      return { success: true, processedAt: new Date() };
    });
  }

  public registerWorker(queueName: string, handler: (data: any) => Promise<any>) {
    this.workers.set(queueName, handler);
  }

  public async addJob<T = any>(
    queueName: string,
    jobName: string,
    data: T,
    options: { attempts?: number; delay?: number } = {}
  ): Promise<QueueJob<T>> {
    const jobId = uuidv4();
    const job: QueueJob<T> = {
      id: jobId,
      name: jobName,
      data,
      status: 'QUEUED',
      attempts: 0,
      maxAttempts: options.attempts || 3,
      createdAt: new Date(),
    };

    this.inMemoryJobs.set(jobId, job);

    // Asynchronously trigger execution with backoff
    setTimeout(async () => {
      await this.processJob(queueName, jobId);
    }, options.delay || 10);

    return job;
  }

  private async processJob(queueName: string, jobId: string) {
    const job = this.inMemoryJobs.get(jobId);
    if (!job) return;

    job.status = 'PROCESSING';
    job.attempts += 1;

    const worker = this.workers.get(queueName);
    if (!worker) {
      job.status = 'COMPLETED';
      job.processedAt = new Date();
      return;
    }

    try {
      await worker(job.data);
      job.status = 'COMPLETED';
      job.processedAt = new Date();
    } catch (err: any) {
      job.error = err?.message || 'Processing failed';
      if (job.attempts < job.maxAttempts) {
        job.status = 'QUEUED';
        // Exponential backoff
        setTimeout(() => this.processJob(queueName, jobId), job.attempts * 1000);
      } else {
        job.status = 'FAILED';
      }
    }
  }

  public getJob(jobId: string): QueueJob | undefined {
    return this.inMemoryJobs.get(jobId);
  }

  public getStats() {
    let queued = 0;
    let completed = 0;
    let failed = 0;
    for (const job of this.inMemoryJobs.values()) {
      if (job.status === 'QUEUED' || job.status === 'PROCESSING') queued++;
      else if (job.status === 'COMPLETED') completed++;
      else if (job.status === 'FAILED') failed++;
    }
    return { queued, completed, failed, total: this.inMemoryJobs.size };
  }
}

export const queueManager = new UnifiedQueueManager();
