import prismaRepository from "../database/prisma.repository";
import { CreateUserDto } from "../dtos";
import * as bcrypt from "bcrypt";

export interface UserEntity {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl?: string | null;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserRepository {
  public async create(data: CreateUserDto): Promise<UserEntity> {

    const user = await prismaRepository.user.create({
      data: {
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        imageUrl: data.imageUrl,
      },
    });

    return {
      ...user,
      imageUrl: user.imageUrl || null,
    } as UserEntity;
  }

  public async findByUsername(username: string): Promise<UserEntity | null> {
    const user = await prismaRepository.user.findUnique({
      where: { username },
    });
    return user as UserEntity | null;
  }

  public async findById(id: string): Promise<UserEntity | null> {
    const user = await prismaRepository.user.findUnique({
      where: { id },
    });
    return user as UserEntity | null;
  }

  public async listAll(): Promise<UserEntity[]> {
    const users = await prismaRepository.user.findMany();
    return users as unknown as UserEntity[];
  }

}