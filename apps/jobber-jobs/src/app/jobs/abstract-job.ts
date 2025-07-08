import { PulsarClient } from '@jobber/pulsar';
import { OnModuleDestroy } from '@nestjs/common';
import { Producer } from 'pulsar-client';

export abstract class AbstractJob {
  private producer: Producer;

  constructor(private readonly client: PulsarClient) {}

  async execute(data: object, job: string): Promise<void> {
    if (!this.producer) this.producer = await this.client.createProducer(job);

    await this.producer.send({
      data: Buffer.from(JSON.stringify(data)),
    });
  }
}
