import { User as UserEntity } from "@prisma/client";

import prismaRepository from "../database/prisma.repository";
import { CreateUserDto } from "../dtos/user.dto";

export class UserRepository {
  public async findByUsername(username: string): Promise<UserEntity | null> {
    return await prismaRepository.user.findUnique({
      where: {
        username,
      },
    });
  }

  public async create(dto: CreateUserDto): Promise<UserEntity> {
    return await prismaRepository.user.create({
      data: {
        name: dto.name,
        imageUrl: dto.imageUrl,
        username: dto.username,
        password: dto.password,
      },
    });
  }

  public async getById(id: string): Promise<UserEntity | null> {
    return await prismaRepository.user.findUnique({
      where: {
        id,
      },
    });
  }

  public async listAll(): Promise<UserEntity[]> {
    return await prismaRepository.user.findMany();
  }
}
