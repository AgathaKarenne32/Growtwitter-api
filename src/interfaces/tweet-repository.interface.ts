import { TweetEntity } from "../repositories/tweet.repository";

export interface ITweetRepository {
  create(data: any): Promise<TweetEntity>;
  findUnique(id: string): Promise<TweetEntity | null>;
  findManyByUserId(userId: string): Promise<TweetEntity[]>;
  delete(id: string): Promise<void>;
  findAll(): Promise<TweetEntity[]>;
}