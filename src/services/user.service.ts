import { IUserRepository } from "../interfaces/user-repository.interface";
import { User } from "../models/user.model";
import { HTTPError } from "../utils/http.error";

export class UserService {
  // Agora depende da Interface (D de SOLID)
  constructor(private userRepository: IUserRepository) {}

  public async getAll(): Promise<User[]> {
    const users = await this.userRepository.findAll();
    return users.map(u => this.mapToModel(u));
  }

  public async getById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new HTTPError(404, "User not found");
    return this.mapToModel(user);
  }

  private mapToModel(entity: any): User {
    return new User(
      entity.id, entity.name, entity.imageUrl, 
      entity.username, entity.createdAt, entity.updatedAt
    );
  }
}