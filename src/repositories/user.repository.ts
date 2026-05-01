import { Prisma } from "@prisma/client";
import prismaRepository from "../database/prisma.repository";

type UserEntity = NonNullable<Awaited<ReturnType<typeof prismaRepository.user.findUnique>>>;

export class UserRepository {
  public async findByUsername(username: string): Promise<UserEntity | null> {
    return await prismaRepository.user.findUnique({ where: { username } });
  }

  public async findById(id: string): Promise<UserEntity | null> {
    return await prismaRepository.user.findUnique({ where: { id } });
  }

  public async create(data: Prisma.UserCreateInput): Promise<UserEntity> {
    return await prismaRepository.user.create({ data });
  }

  public async findAll(): Promise<UserEntity[]> {
    return await prismaRepository.user.findMany();
  }
}