import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly $prisma: PrismaService) {}

  async create(data: CreateUserDTO): Promise<User> {
    return await this.$prisma.user.create({ data });
  }

  async list(): Promise<User[]> {
    return await this.$prisma.user.findMany();
  }

  async show(id: number): Promise<User> {
    await this.exists(id);

    return await this.$prisma.user.findUnique({
      where: { id },
    });
  }

  async update(data: UpdatePutUserDTO, id: number): Promise<User> {
    await this.exists(id);
    const { name, email, password, birthAt } = data;
    return this.$prisma.user.update({
      data: {
        name,
        email,
        password,
        birthAt: birthAt ? new Date(birthAt) : null,
      },
      where: { id },
    });
  }

  async updatePartial(data: UpdatePatchUserDTO, id: number): Promise<User> {
    await this.exists(id);
    return this.$prisma.user.update({ data, where: { id } });
  }

  async delete(id: number): Promise<User> {
    await this.exists(id);
    return await this.$prisma.user.delete({ where: { id } });
  }

  async exists(id: number): Promise<boolean> {
    const exists: number = await this.$prisma.user.count({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException(`user not found: ${id}`);
    }

    return true;
  }
}
