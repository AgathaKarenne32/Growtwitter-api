import { UserEntity } from "../repositories/user.repository";

export interface IUserRepository {
  create(data: any): Promise<UserEntity>;
  findByUsername(username: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
}