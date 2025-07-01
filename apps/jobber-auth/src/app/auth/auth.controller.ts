import { Controller, Logger, UseGuards } from '@nestjs/common';
import {
  AuthenticateRequest,
  AuthServiceController,
  AuthServiceControllerMethods,
  User,
} from 'types/proto/auth';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  private logger = new Logger(AuthController.name);

  @UseGuards(JwtAuthGuard)
  async authenticate(request: AuthenticateRequest): Promise<User> {
    this.logger.log(request);
    return { id: 1, email: 'dsfasdf' } as User;
  }
}
