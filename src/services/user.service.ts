import { CreateUserDto } from "../dtos";
import { User } from "../models";
import { UserRepository, UserEntity } from "../repositories/user.repository";
import { HTTPError } from "../utils";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  public async create(dto: CreateUserDto): Promise<User> {
    const newUser = await this.userRepository.create(dto);
    return this.mapToModel(newUser);
  }

  public async findByUsername(username: string): Promise<User | null> {
    const userEntity = await this.userRepository.findByUsername(username);

    if (!userEntity) {
      return null;
    }

    return this.mapToModel(userEntity);
  }

  public async getById(id: string): Promise<User> {
    const userEntity = await this.userRepository.findById(id);

    if (!userEntity) {
      throw new HTTPError(404, "User not found");
    }

    return this.mapToModel(userEntity);
  }

  public async listAll(): Promise<User[]> {
    const usersDB = await this.userRepository.listAll();
    return usersDB.map((user) => this.mapToModel(user));
  }

  private mapToModel(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.name,
      entity.imageUrl || "",
      entity.username,
      entity.createdAt,
      entity.updatedAt
    );
  }
}