import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginInput } from './dto/login.input';
import { UserService } from '../user/user.service';
import { Response } from 'express';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './token.payload.interface';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async login({ email, password }: LoginInput, res: Response) {
    const user = await this.validateUser(email, password);

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() +
        (await this.configService.getOrThrow<number>('JWT_EXPIRATION_MS'))
    );

    const tokenPayload: TokenPayload = {
      userId: user.id,
    };

    const token = this.jwtService.sign(tokenPayload);

    res.cookie('token', token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      expires,
    });

    return user;
  }

  private async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.getUser({
        email,
      });

      const passwordMatch = await argon2.verify(user.password, password);

      if (!passwordMatch) throw new UnauthorizedException();
      return user;
    } catch (_) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
