import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PulsarClient, PulsarConsumer } from '@jobber/pulsar';
import { Message } from 'pulsar-client';

@Injectable({})
export class FibonacciConsumer extends PulsarConsumer implements OnModuleInit {
  private readonly logger = new Logger(FibonacciConsumer.name);

  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient, 'Fibonacci');
  }

  protected async onMessage(message: Message): Promise<void> {
    console.log('Fib consumer =========>', message);
    await this.acknowledge(message);
  }
}
