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
import { TweetEntity, TweetRepository } from "../repositories/tweet.repository";

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

    if (tweet.type === "REPLY") {
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

    if (!tweetDB || !tweetDB.author) {
      throw new HTTPError(404, "Tweet not found");
    }

    const replies = await this.listRepliesByTweetId(tweetDB.id);
    const likes = await this.likeService.listLikesByTweetId(tweetDB.id);
    
    const author = new User(
      tweetDB.author.id,
      tweetDB.author.name,
      tweetDB.author.imageUrl!, // Forçando a tipagem aqui
      tweetDB.author.username,
      tweetDB.author.createdAt,
      tweetDB.author.updatedAt,
    );

    const tweet = this.mapToModel(tweetDB as unknown as TweetEntity);
    tweet.withAuthor(author);
    tweet.withReplies(replies);
    tweet.withLikes(likes);

    return tweet;
  }

  public async updateTweet(dto: UpdateTweetDto): Promise<Tweet> {
    const tweetDB = await this.tweetRepository.findUnique(dto.tweetId);
    
    if (!tweetDB) throw new HTTPError(404, "Tweet not found");
    if (tweetDB.authorId !== dto.authorId) {
      throw new HTTPError(403, "You are not allowed to update this tweet");
    }

    const tweetUpdated = await this.tweetRepository.update(dto.tweetId, {
      content: dto.content 
    });

    return this.mapToModel(tweetUpdated as unknown as TweetEntity);
  }

  public async deleteTweet(dto: DeleteTweetDto): Promise<Tweet> {
    const tweetDB = await this.tweetRepository.findUnique(dto.tweetId);
    
    if (!tweetDB) throw new HTTPError(404, "Tweet not found");
    if (tweetDB.authorId !== dto.authorId) {
      throw new HTTPError(403, "You are not allowed to delete this tweet");
    }

    const tweetDeleted = await this.tweetRepository.delete(dto.tweetId);
    return this.mapToModel(tweetDeleted);
  }

  public async listTweetsByUserId(userId: string): Promise<Tweet[]> {
    const tweetsDB = await this.tweetRepository.findManyByUserId(userId);
    return tweetsDB.map(tweet => this.mapToModel(tweet));
  }

  private async listRepliesByTweetId(tweetId: string): Promise<Tweet[]> {
    const repliesDB = await this.tweetRepository.listRepliesByTweetId(tweetId);
    const replies: Tweet[] = [];

    for (const r of repliesDB) {
      if (r.author) {
        const replyModel = this.mapToModel(r as unknown as TweetEntity);
        const author = new User(
          r.author.id,
          r.author.name,
          r.author.imageUrl!,
          r.author.username,
          r.author.createdAt,
          r.author.updatedAt
        );
        replyModel.withAuthor(author);
        replies.push(replyModel);
      }
    }
    return replies;
  }

  public async feed(userId: string): Promise<Tweet[]> {
    const tweetsDB = await this.tweetRepository.feed(userId);
    return tweetsDB.map((tweetDB) => {
        const tweetModel = this.mapToModel(tweetDB);
        if (tweetDB.author) {
            const author = new User(
                tweetDB.author.id,
                tweetDB.author.name,
                tweetDB.author.imageUrl!,
                tweetDB.author.username,
                tweetDB.author.createdAt,
                tweetDB.author.updatedAt
            );
            tweetModel.withAuthor(author);
        }
        return tweetModel;
    });
  }

  public async listFeed(page: number = 1, perPage: number = 10): Promise<Tweet[]> {
    const tweetsDB = await this.tweetRepository.listAll(page, perPage);
    
    return tweetsDB.map((tweetDB) => {
      const tweetModel = this.mapToModel(tweetDB);
      
      if (tweetDB.author) {
        const author = new User(
          tweetDB.author.id,
          tweetDB.author.name,
          tweetDB.author.imageUrl!,
          tweetDB.author.username,
          tweetDB.author.createdAt,
          tweetDB.author.updatedAt
        );
        tweetModel.withAuthor(author);
      }

      return tweetModel;
    });
  }

  private mapToModel(entity: TweetEntity): Tweet {
    return new Tweet(
      entity.id,
      entity.content,
      entity.type as any,
      entity.createdAt,
      entity.updatedAt,
      entity.parentTweetId ? undefined : entity.author ? new User(
        entity.author.id,
        entity.author.name,
        entity.author.imageUrl!,
        entity.author.username,
        entity.author.createdAt,
        entity.author.updatedAt
      ) : undefined
    );
  }
}