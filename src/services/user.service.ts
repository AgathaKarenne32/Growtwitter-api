import { FollowService, TweetService } from ".";
import { CreateUserDto } from "../dtos/user.dto";
import { User } from "../models";
import { UserEntity, UserRepository } from "../repositories/user.repository";
import { HTTPError } from "../utils";

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private tweetService: TweetService,
    private followService: FollowService,
  ) {}

<<<<<<< feature/data-validation-zod
  public async findByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) return null;

    return this.mapToModel(user).withPassword(user.password);
  }

  public async create(dto: CreateUserDto): Promise<User> {
    const newUser = await this.userRepository.create(dto);

    return this.mapToModel(newUser);
  }

  
  public async getById(userId: string): Promise<User> {
    const userDB = await this.userRepository.findById(userId);
=======
  public async getById(userId: string): Promise<User> {
    // Ajustado de getById para findById para bater com o repositório
    const userDB = await this.userRepository.findById(userId);

>>>>>>> main
    if (!userDB) {
      throw new Error('User not found');
    }

    const user = this.mapToModel(userDB);

    const tweetsOfUser = await this.tweetService.listTweetsByUserId(userId);
    user.withTweets(tweetsOfUser);

    const follows = await this.followService.listFollowings(userId);
    user.withFollowing(follows.followings);
    user.withFollowers(follows.followers);

    return user;
  }

  public async listAll(): Promise<User[]> {
<<<<<<< feature/data-validation-zod
    const users = await this.userRepository.findAll();

    return users.map((user: { id: string; name: string; imageUrl: string | null; username: string; password: string; createdAt: Date; updatedAt: Date; }) => this.mapToModel(user));
=======
    // Ajustado de listAll para findAll
    const users = await this.userRepository.findAll();
    return users.map((user: UserEntity) => this.mapToModel(user));
>>>>>>> main
  }

  private mapToModel(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.name,
      entity.imageUrl,
      entity.username,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}