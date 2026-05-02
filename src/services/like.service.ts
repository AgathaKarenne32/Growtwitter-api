import { CreateLikeDto } from "../dtos";
import { Like, User } from "../models";
import { HTTPError } from "../utils";
import { LikeEntity, LikeRepository } from "../repositories/like.repository";
import { UserEntity } from "../repositories/user.repository";
import { TweetRepository } from "../repositories/tweet.repository";

export class LikeService {
  constructor(
    private likeRepository: LikeRepository,
    private tweetRepository: TweetRepository,
  ) {}

  public async listLikesByTweetId(tweetId: string): Promise<Like[]> {
    const likes = await this.likeRepository.findManyByTweetId(tweetId);

    return likes.map((l) => this.mapToModel(l));
  }

  public async createLike(dto: CreateLikeDto): Promise<void> {
    const tweet = await this.tweetRepository.findUnique(dto.tweetId);

    if (!tweet) {
      throw new HTTPError(404, "Tweet not found.");
    }

    const likeAlreadyExists = await this.likeRepository.findUnique(
      dto.tweetId,
      dto.authorId,
    );

    if (likeAlreadyExists) {
      throw new HTTPError(409, "Tweet already likes for you.");
    }

    await this.likeRepository.create(dto);
  }

  public async removeLike(dto: CreateLikeDto): Promise<void> {
    const tweet = await this.tweetRepository.findUnique(dto.tweetId);

    if (!tweet) {
      throw new HTTPError(404, "Tweet not found.");
    }

    const likeFound = await this.likeRepository.findUnique(
      dto.tweetId,
      dto.authorId,
    );

    if (!likeFound) {
      throw new HTTPError(404, "Tweet not likes for you.");
    }

    await this.likeRepository.delete(dto.tweetId, dto.authorId);
  }

  private mapToModel(entity: LikeEntity & { author: UserEntity }): Like {
    return new Like(
      new User(
        entity.author.id,
        entity.author.name,
        entity.author.imageUrl || null, 
        entity.author.username,
        entity.author.createdAt,
        entity.author.updatedAt,
      ),
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
