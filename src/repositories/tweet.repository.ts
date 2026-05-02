import prismaRepository from "../database/prisma.repository";
import { CreateTweetDto } from "../dtos";
import { TweetEntity } from "../interfaces/tweet-repository.interface";
import { TweetType as PrismaTweetType } from "@prisma/client";

export type TweetType = PrismaTweetType;

export class TweetRepository {
  public async findUniqueWithAuthor(id: string) {
    return await prismaRepository.tweet.findUnique({
      where: { id },
      include: { author: true }
    });
  }

  public async update(id: string, data: any) {
    return await prismaRepository.tweet.update({ where: { id }, data });
  }

  public async listRepliesByTweetId(tweetId: string) {
    const replies = await prismaRepository.reply.findMany({
      where: { tweetId },
      include: { reply: { include: { author: true } } }
    });
    return replies.map(r => r.reply);
  }

  public async feed(userId: string) {
    return await prismaRepository.tweet.findMany({
      include: { author: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  public async createReply(
    content: string,
    authorId: string,
    replyTo: string,
  ): Promise<TweetEntity> {
    return await prismaRepository.$transaction(async (prisma) => {
      const newTweetReply = await prisma.tweet.create({
        data: {
          content,
          authorId,
          type: "REPLY", 
        },
      });

      await prisma.reply.create({
        data: { tweetId: replyTo, replyId: newTweetReply.id },
      });

      return newTweetReply as unknown as TweetEntity;
    });
  }

  public async findUnique(id: string): Promise<TweetEntity | null> {
    return await prismaRepository.tweet.findUnique({
      where: { id },
    }) as unknown as TweetEntity | null;
  }

  public async delete(id: string): Promise<TweetEntity> {
    return await prismaRepository.tweet.delete({
      where: { id },
      include: { author: true } 
    }) as unknown as TweetEntity;
  } 

  public async findManyByUserId(userId: string): Promise<TweetEntity[]> {
    return await prismaRepository.tweet.findMany({
      where: { type: "NORMAL", authorId: userId },
      orderBy: { createdAt: "desc" },
    }) as unknown as TweetEntity[];
  }

  public async findAll(): Promise<TweetEntity[]> {
    return await prismaRepository.tweet.findMany({
      include: { author: true }
    }) as unknown as TweetEntity[];
  }

  public async create(data: CreateTweetDto): Promise<TweetEntity> {
    return await prismaRepository.tweet.create({
      data: {
        content: data.content || "",
        type: data.type,
        authorId: data.authorId,
        parentTweetId: data.parentTweetId, 
      },
    }) as unknown as TweetEntity;
  }

  public async listAll(page: number, perPage: number): Promise<TweetEntity[]> {
    return await prismaRepository.tweet.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        parentTweet: { 
          include: {
            author: true
          }
        }
      },
    }) as unknown as TweetEntity[];
  }
} 