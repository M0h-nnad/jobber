import { Injectable, OnModuleInit, BadRequestException } from '@nestjs/common';
import {
  DiscoveredClassWithMeta,
  DiscoveryService,
} from '@golevelup/nestjs-discovery';
import { JOB_METADATA_KEY } from './decorator/job.decorator';
import { AbstractJob } from './jobs/abstract-job';
import { JobMetadata } from './interfaces/job-metadata.interface';

@Injectable()
export class JobService implements OnModuleInit {
  private jobs: DiscoveredClassWithMeta<JobMetadata>[] = [];

  constructor(private readonly discoveryService: DiscoveryService) {}

  async onModuleInit() {
    this.jobs = await this.discoveryService.providersWithMetaAtKey(
      JOB_METADATA_KEY
    );
  }

  getJobs() {
    return this.jobs.map((job) => job.meta);
  }

  async executeJob(name: string, data: object) {
    const job = this.jobs.find((job) => job.meta.name === name);
    if (!job) throw new BadRequestException(`Job ${name} not found`);
    await (job.discoveredClass.instance as AbstractJob<any>).execute(
      data,
      job.meta.name
    );
    return job.meta;
  }
}
