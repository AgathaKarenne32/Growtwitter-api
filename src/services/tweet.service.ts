import { LikeService } from ".";
import {
  CreateReplyDto,
  CreateTweetDto,
  DeleteTweetDto,
  FindTweetDto,
  UpdateTweetDto,
} from "../dtos";
import { Tweet, User } from "../models";
import { HTTPError } from "../utils";
import { TweetEntity, TweetRepository, TweetType } from "../repositories/tweet.repository";
import { UserEntity } from "../repositories/user.repository";

export class TweetService {
  constructor(
    private tweetRepository: TweetRepository,
    private likeService: LikeService,
  ) {}

  public async createTweet(dto: CreateTweetDto): Promise<Tweet> {
    const newTweet = await this.tweetRepository.create(dto);

    return this.mapToModel(newTweet);
  }

  public async createReply(dto: CreateReplyDto): Promise<Tweet> {
    const tweet = await this.tweetRepository.findUnique(dto.replyTo);

    if (!tweet) {
      throw new HTTPError(404, "Tweet to reply not found");
    }

    if (tweet.type === TweetType.REPLY) {
      throw new HTTPError(409, "Cannot reply to a reply");
    }

    const newReply = await this.tweetRepository.createReply(
      dto.content,
      dto.authorId,
      dto.replyTo,
    );

    return this.mapToModel(newReply);
  }

  public async findTweet(dto: FindTweetDto): Promise<Tweet> {
    const tweetDB = await this.tweetRepository.findUniqueWithAuthor(dto.tweetId);

    if (!tweetDB) {
      throw new HTTPError(404, "Tweet not found");
    }

    const replies = await this.listRepliesByTweetId(tweetDB.id);
    const likes = await this.likeService.listLikesByTweetId(tweetDB.id);
    const author = new User(
      tweetDB.author.id,
      tweetDB.author.name,
      tweetDB.author.imageUrl,
      tweetDB.author.username,
      tweetDB.author.createdAt,
      tweetDB.author.updatedAt,
    );

    const tweet = this.mapToModel(tweetDB);
    tweet.withAuthor(author);
    tweet.withReplies(replies);
    tweet.withLikes(likes);

    return tweet;
  }

  public async updateTweet(dto: UpdateTweetDto): Promise<Tweet> {
    const tweetFound = await this.findTweet(dto);

    if (tweetFound.toJSON()?.author?.id !== dto.authorId) {
      throw new HTTPError(403, "You are not allowed to update this tweet");
    }

    const tweetUpdated = await this.tweetRepository.update(
      dto.tweetId,
      dto.content,
    );

    return this.mapToModel(tweetUpdated);
  }

  public async deleteTweet(dto: DeleteTweetDto): Promise<Tweet> {
    const tweetFound = await this.findTweet(dto);

    if (tweetFound.toJSON()?.author?.id !== dto.authorId) {
      throw new HTTPError(403, "You are not allowed to delete this tweet");
    }

    const tweetDeleted = await this.tweetRepository.delete(dto.tweetId);

    return this.mapToModel(tweetDeleted);
  }

  public async listTweetsByUserId(userId: string): Promise<Tweet[]> {
    const tweetsDB = await this.tweetRepository.findManyByUserId(userId);

    const tweets: Tweet[] = [];

    for (const tweet of tweetsDB) {
      const replies = await this.listRepliesByTweetId(tweet.id);
      const likes = await this.likeService.listLikesByTweetId(tweet.id);

      const author = new User(
        tweet.author.id,
        tweet.author.name,
        tweet.author.imageUrl,
        tweet.author.username,
        tweet.author.createdAt,
        tweet.author.updatedAt,
      );

      const tweetModel = this.mapToModel(tweet);
      tweetModel.withLikes(likes);
      tweetModel.withReplies(replies);
      tweetModel.withAuthor(author);
      tweets.push(tweetModel);
    }

    return tweets;
  }

  private async listRepliesByTweetId(tweetId: string): Promise<Tweet[]> {
    const repliesDB = await this.tweetRepository.listRepliesByTweetId(tweetId);

    const replies: Tweet[] = [];

    for (const r of repliesDB) {
      const author = new User(
        r.reply.author.id,
        r.reply.author.name,
        r.reply.author.imageUrl,
        r.reply.author.username,
        r.reply.author.createdAt,
        r.reply.author.updatedAt,
      );

      const likes = await this.likeService.listLikesByTweetId(r.reply.id);

      const reply = new Tweet(
        r.reply.id,
        r.reply.content,
        r.reply.type,
        r.reply.createdAt,
        r.reply.updatedAt,
      );

      reply.withAuthor(author);
      reply.withLikes(likes);
      replies.push(reply);
    }

    return replies;
  }

  public async feed(userId: string) {
    const tweetsDB = await this.tweetRepository.feed(userId);

    const tweets: Tweet[] = [];

    for (const tweet of tweetsDB) {
      const replies = await this.listRepliesByTweetId(tweet.id);
      const likes = await this.likeService.listLikesByTweetId(tweet.id);

      const author = new User(
        tweet.author.id,
        tweet.author.name,
        tweet.author.imageUrl,
        tweet.author.username,
        tweet.author.createdAt,
        tweet.author.updatedAt,
      );

      const tweetModel = this.mapToModel(tweet);
      tweetModel.withAuthor(author);
      tweetModel.withReplies(replies);
      tweetModel.withLikes(likes);
      tweets.push(tweetModel);
    }

    return tweets;
  }

  private mapToModel(entity: TweetEntity): Tweet {
    return new Tweet(
      entity.id,
      entity.content,
      entity.type,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
