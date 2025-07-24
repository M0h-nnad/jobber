import { PulsarClient } from '@jobber/pulsar';
import { Job } from '../../decorator/job.decorator';
import { AbstractJob } from '../abstract-job';
import { FibonacciData } from './fibonnacci-data.message';

@Job({
  name: 'Fibonacci',
  description: 'Generate a Fibonacci sequance and store it in the DB.',
})
export class FibonacciJobs extends AbstractJob<FibonacciData> {
  protected messageClass: new () => FibonacciData = FibonacciData;
  constructor(client: PulsarClient) {
    super(client);
  }
}
