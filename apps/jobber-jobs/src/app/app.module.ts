import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobsModule } from './jobs/jobs.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
@Module({
  imports: [
    ConfigModule,
    JobsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req, res }) => ({ req, res }),
      // Modern Apollo Studio Explorer configuration
      introspection: true,
      plugins: [
        // Use Apollo Studio's modern landing page (replaces default)
        ApolloServerPluginLandingPageLocalDefault({
          embed: true,
          includeCookies: true,
        }),
      ],
      // Disable the default playground to avoid conflicts
      playground: false,
    }),
  ],
})
export class AppModule {}
