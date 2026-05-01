import { LikeEntity } from "../repositories/like.repository";
import { UserEntity } from "../repositories/user.repository";

export interface ILikeRepository {
  create(dto: { authorId: string; tweetId: string }): Promise<void>;
  findUnique(tweetId: string, authorId: string): Promise<LikeEntity | null>;
  findManyByTweetId(tweetId: string): Promise<(LikeEntity & { author: UserEntity })[]>;
  delete(tweetId: string, authorId: string): Promise<void>;
}