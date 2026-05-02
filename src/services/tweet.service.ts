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

    // Agora TweetType é um valor real (enum/const) e pode ser comparado
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

    if (!tweetDB || !tweetDB.author) {
      throw new HTTPError(404, "Tweet not found");
    }

    const replies = await this.listRepliesByTweetId(tweetDB.id);
    const likes = await this.likeService.listLikesByTweetId(tweetDB.id);
    
    // Garantimos que o author existe com ! após a verificação acima
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
    // Verificamos se o tweet existe e pertence ao autor
    const tweetDB = await this.tweetRepository.findUnique(dto.tweetId);
    
    if (!tweetDB) throw new HTTPError(404, "Tweet not found");
    if (tweetDB.authorId !== dto.authorId) {
      throw new HTTPError(403, "You are not allowed to update this tweet");
    }

    const tweetUpdated = await this.tweetRepository.update(dto.tweetId, {
      content: dto.content 
    });

    return this.mapToModel(tweetUpdated);
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
    const tweets: Tweet[] = [];

    for (const tweet of tweetsDB) {
      const tweetModel = this.mapToModel(tweet);
      tweets.push(tweetModel);
    }

    return tweets;
  }

  private async listRepliesByTweetId(tweetId: string): Promise<Tweet[]> {
    const repliesDB = await this.tweetRepository.listRepliesByTweetId(tweetId);
    const replies: Tweet[] = [];

    for (const r of repliesDB) {
      if (r.author) {
        const replyModel = this.mapToModel(r);
        const author = new User(
          r.author.id,
          r.author.name,
          r.author.imageUrl,
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
    const tweets: Tweet[] = [];

    for (const tweet of tweetsDB) {
      const tweetModel = this.mapToModel(tweet);
      if (tweet.author) {
         const author = new User(
          tweet.author.id,
          tweet.author.name,
          tweet.author.imageUrl,
          tweet.author.username,
          tweet.author.createdAt,
          tweet.author.updatedAt
        );
        tweetModel.withAuthor(author);
      }
      tweets.push(tweetModel);
    }

    return tweets;
  }

  private mapToModel(entity: TweetEntity): Tweet {
    return new Tweet(
      entity.id,
      entity.content,
      entity.type as any,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}