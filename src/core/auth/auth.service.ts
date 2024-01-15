import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtsvc: JwtService,
    private readonly prismasvc: PrismaService,
    private readonly usersvc: UserService,
  ) {}

  async createToken(user: User) {
    return {
      accessToken: this.jwtsvc.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          expiresIn: '7 days',
          subject: String(user.id),
          issuer: 'login',
          audience: 'users',
        },
      ),
    };
  }

  async verifyToken() {
    // return this.$jwt.verify();
  }

  async login(email: string, password: string) {
    const user: User = await this.prismasvc.user.findFirst({
      where: {
        email,
        password,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email/Password are invalid!');
    }

    return this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.prismasvc.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email is invalid!');
    }

    // TODO send an email

    return true;
  }

  async reset(password: string, token: string) {
    // TODO validar e extrair os dados do token
    console.log(token);
    const id = 0; // TODO este id vem do token

    const user: User = await this.prismasvc.user.update({
      where: { id },
      data: { password },
    });

    return this.createToken(user);
  }

  async register(data: AuthRegisterDTO) {
    const user: User = await this.usersvc.create(data);
    return this.createToken(user);
  }
}
