import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './stratgies/jwt.strategy';
import { AuthController } from './auth.controller';
@Module({
  providers: [AuthResolver, AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<string>('JWT_EXPIRATION_MS'),
        },
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
