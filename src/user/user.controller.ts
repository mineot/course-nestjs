import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { ParamId } from 'src/core/decorators/param-id.decorator';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from 'src/core/enums/role.enum';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { RoleGuard } from 'src/core/guards/role.guard';
import { LogInterceptor } from 'src/core/interceptors/log/log.interceptor';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UserService } from './user.service';

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor) // para interceptar todas as rotas
@Controller('users')
export class UserController {
  constructor(private readonly $userSrv: UserService) {}

  @Roles(Role.ADMIN)
  @UseInterceptors(LogInterceptor) // para interceptar apenas uma rota
  @Post()
  async create(@Body() data: CreateUserDTO): Promise<User> {
    return await this.$userSrv.create(data);
  }

  @Roles(Role.ADMIN)
  @Get()
  async list(): Promise<User[]> {
    return this.$userSrv.list();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  async show(@ParamId() id: number): Promise<User> {
    return this.$userSrv.show(id);
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  async update(
    @Body() data: UpdatePutUserDTO,
    @ParamId() id: number,
  ): Promise<User> {
    return await this.$userSrv.update(data, id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async partialUpdate(
    @Body() data: UpdatePatchUserDTO,
    @ParamId() id: number,
  ): Promise<User> {
    return this.$userSrv.updatePartial(data, id);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@ParamId() id: number): Promise<User> {
    return this.$userSrv.delete(id);
  }
}
