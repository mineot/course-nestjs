import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';

@Injectable()
export class AuthService {
  private readonly $expiresIn = '7 days';
  private readonly $audience = 'users';
  private readonly $issuer = 'login';

  constructor(
    private readonly jwtsvc: JwtService,
    private readonly prismasvc: PrismaService,
    private readonly usersvc: UserService,
    private readonly mailer: MailerService,
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
          subject: String(user.id),
          expiresIn: this.$expiresIn,
          issuer: this.$issuer,
          audience: this.$audience,
        },
      ),
    };
  }

  async verifyToken(token: string) {
    try {
      const data = this.jwtsvc.verify(token, {
        issuer: this.$issuer,
        audience: this.$audience,
      });

      return data;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async isValidToken(token: string) {
    try {
      await this.verifyToken(token);
      return true;
    } catch (err) {
      return false;
    }
  }

  async login(email: string, password: string) {
    const user: User = await this.prismasvc.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email/Password are invalid!');
    }

    if (!(await bcrypt.compare(password, user.password))) {
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

    const resetToken = this.jwtsvc.sign(
      {
        id: user.id,
      },
      {
        subject: String(user.id),
        expiresIn: '30 minutes',
        issuer: 'forget',
        audience: 'users',
      },
    );

    await this.mailer.sendMail({
      subject: 'Reset your password',
      to: 'test@test.com',
      template: 'forget',
      context: {
        name: user.name,
        token: resetToken,
      },
    });

    return true;
  }

  async reset(password: string, token: string) {
    try {
      const data: any = this.jwtsvc.verify(token, {
        issuer: 'forget',
        audience: 'users',
      });

      if (isNaN(Number(data.id))) {
        throw new BadRequestException('Invalid Token');
      }

      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(password, salt);

      const user: User = await this.prismasvc.user.update({
        where: { id: Number(data.id) },
        data: { password },
      });

      return this.createToken(user);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async register(data: AuthRegisterDTO) {
    const user: User = await this.usersvc.create(data);
    return this.createToken(user);
  }
}
