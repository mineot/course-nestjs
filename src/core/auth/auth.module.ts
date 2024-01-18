import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { FileModule } from '../file/file.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PrismaModule,
    FileModule,
    JwtModule.register({
      //   privateKey: '', // aqui poderemos gerar usando um gerador ssh
      //   publicKey: '',
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
