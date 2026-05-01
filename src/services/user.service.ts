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

  public async getById(userId: string): Promise<User> {
    // Ajustado de getById para findById para bater com o repositório
    const userDB = await this.userRepository.findById(userId);

    if (!userDB) {
      throw new HTTPError(404, "User not found");
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
    // Ajustado de listAll para findAll
    const users = await this.userRepository.findAll();
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