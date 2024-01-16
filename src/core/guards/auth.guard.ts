import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authsvc: AuthService,
    private readonly usersvc: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    try {
      const token = authorization?.split(' ')[1];
      const data = await this.authsvc.verifyToken(token);
      request.tokenPayload = data;
      request.user = await this.usersvc.show(data.id);
      return true;
    } catch (err) {
      return false;
    }
  }
}
