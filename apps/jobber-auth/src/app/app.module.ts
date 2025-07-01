import { Module } from '@nestjs/common';
import { PrismaModule } from './primsa/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
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
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
