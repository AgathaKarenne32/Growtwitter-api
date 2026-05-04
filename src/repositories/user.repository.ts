import prismaRepository from "../database/prisma.repository";
import { CreateUserDto } from "../dtos";
import * as bcrypt from "bcrypt";

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
    // 1. Criptografa a senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // 2. Salva no banco com a senha protegida
    return await prismaRepository.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  // Método essencial para o Login e Registro funcionarem
  public async findByUsername(username: string): Promise<UserEntity | null> {
    return await prismaRepository.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        name: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      }
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

  public get password(): string | undefined {
    return this.password;
  }
}