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

  public async findByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findByUsername(username);
    
    if (!user) return null;
    
    // O fallback para string vazia evita erros se o password for undefined
    return this.mapToModel(user).withPassword(user.password || "");
  }

  public async create(dto: CreateUserDto): Promise<User> {
    const newUser = await this.userRepository.create(dto);
    return this.mapToModel(newUser);
  }

  public async getById(userId: string): Promise<User> {
    const userDB = await this.userRepository.findById(userId) as UserEntity | null;

    if (!userDB) {
      throw new HTTPError(404, "User not found");
    }

    const user = this.mapToModel(userDB);
    
    // Buscando dados complementares via outros services
    const tweetsOfUser = await this.tweetService.listTweetsByUserId(userId);
    user.withTweets(tweetsOfUser);

    const follows = await this.followService.listFollowings(userId);
    user.withFollowing(follows.followings);
    user.withFollowers(follows.followers);

    return user;
  }

  public async listAll(): Promise<User[]> {
    const users = await this.userRepository.findAll() as UserEntity[];
    return users.map((user: UserEntity) => this.mapToModel(user));
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