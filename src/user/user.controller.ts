import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { LogInterceptor } from 'src/core/interceptors/log/log.interceptor';
import { ParamId } from 'src/core/decorators/param-id.decorator';

@UseInterceptors(LogInterceptor) // para interceptar todas as rotas
@Controller('users')
export class UserController {
  constructor(private readonly $userSrv: UserService) {}

  @UseInterceptors(LogInterceptor) // para interceptar apenas uma rota
  @Post()
  async create(@Body() data: CreateUserDTO): Promise<User> {
    return await this.$userSrv.create(data);
  }

  @Get()
  async list(): Promise<User[]> {
    return this.$userSrv.list();
  }

  @Get(':id')
  async show(@ParamId() id: number): Promise<User> {
    return this.$userSrv.show(id);
  }

  @Put(':id')
  async update(
    @Body() data: UpdatePutUserDTO,
    @ParamId() id: number,
  ): Promise<User> {
    return await this.$userSrv.update(data, id);
  }

  @Patch(':id')
  async partialUpdate(
    @Body() data: UpdatePatchUserDTO,
    @ParamId() id: number,
  ): Promise<User> {
    return this.$userSrv.updatePartial(data, id);
  }

  @Delete(':id')
  async delete(@ParamId() id: number): Promise<User> {
    return this.$userSrv.delete(id);
  }
}
