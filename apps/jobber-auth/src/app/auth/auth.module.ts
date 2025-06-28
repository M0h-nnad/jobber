import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [AuthResolver, AuthService],
  imports: [
    JwtModule.registerAsync({
      imports:[ConfigService],
      useFactory:(configService:ConfigService)=>({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.getOrThrow<string>('JWT_EXPIRATION_MS') },
      })
    })
  ]
})
export class AuthModule {}
