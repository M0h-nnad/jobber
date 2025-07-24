import { Injectable } from '@nestjs/common';
import { PrismaService } from '../primsa/prisma.service';
import { Prisma } from '@prisma-client/auth';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  getUsers(args?: Prisma.UserWhereInput) {
    return this.prisma.user.findMany({ where: args });
  }

  getUser(args: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where: args,
    });
  }

  async createUser(args: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data: {
        ...args,
        password: await argon2.hash(args.password),
      },
    });
  }
}
