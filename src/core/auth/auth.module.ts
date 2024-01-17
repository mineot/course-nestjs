import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PrismaModule,
    JwtModule.register({
      //   privateKey: '', // aqui poderemos gerar usando um gerador ssh
      //   publicKey: '',
      secret: '00nxirD%t]azh%M_7hh~]C~f3qPYa]mx',
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
