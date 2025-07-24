import { PulsarClient, serialize } from '@jobber/pulsar';
import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Producer } from 'pulsar-client';

export abstract class AbstractJob<T extends object> {
  private producer: Producer;
  protected abstract messageClass: new () => T;

  constructor(private readonly client: PulsarClient) {}

  async execute(data: T, job: string): Promise<void> {
    await this.validateData(data);
    if (!this.producer) this.producer = await this.client.createProducer(job);

    await this.producer.send({
      data: serialize(data),
    });
  }

  private async validateData(data: T) {
    const errors = await validate(plainToInstance(this.messageClass, data));

    if (errors.length) {
      throw new BadRequestException(
        `job data invalid: ${JSON.stringify(errors)}`
      );
    }
  }
}
