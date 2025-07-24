import { Module } from '@nestjs/common';
import { FibonacciJobs } from './jobs/fibonacci/fibonacci.jobs';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { JobService } from './job.service';
import { JobsResolver } from './jobs.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME } from 'types/proto/auth';
import { join } from 'path';
import { PulsarModule } from '@jobber/pulsar';

@Module({
  imports: [
    DiscoveryModule,
    ClientsModule.register([
      {
        name: AUTH_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: AUTH_PACKAGE_NAME,
          protoPath: join(__dirname, 'proto/auth.proto'),
          url: 'localhost:3002',
        },
      },
    ]),
    PulsarModule,
  ],
  providers: [FibonacciJobs, JobService, JobsResolver],
})
export class JobsModule {}
