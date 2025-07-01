import { Job } from '../decorator/job.decorator';
import { AbstractJob } from './abstract-job';

@Job({
  name: 'Fibonacci',
  description: 'Generate a Fibonacci sequance and store it in the DB.',
})
export class FibonacciJobs extends AbstractJob {}
