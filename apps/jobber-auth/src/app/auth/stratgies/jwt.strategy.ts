import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../../auth/token.payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (request: any) => request?.cookies?.token || request?.token,
      ]),
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  validate(payload: TokenPayload) {
    return payload;
  }
}
