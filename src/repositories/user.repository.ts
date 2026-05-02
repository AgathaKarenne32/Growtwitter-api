import prismaRepository from "../database/prisma.repository";
import { CreateUserDto } from "../dtos";

export interface UserEntity {
  id: string;
  name: string;
  username: string;
  imageUrl?: string | null;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserRepository {
  public async create(data: CreateUserDto): Promise<UserEntity> {
    return await prismaRepository.user.create({
      data: {
        name: data.name,
        username: data.username,
        imageUrl: data.imageUrl,
        password: data.password,
      },
    });
  }

  // Método essencial para o Login e Registro funcionarem
  public async findByUsername(username: string): Promise<UserEntity | null> {
    return await prismaRepository.user.findUnique({
      where: { username },
    });
  }

  public async findById(id: string): Promise<UserEntity | null> {
    return await prismaRepository.user.findUnique({
      where: { id },
    });
  }

  public async listAll(): Promise<UserEntity[]> {
    return await prismaRepository.user.findMany();
  }
}