import prismaRepository from "../database/prisma.repository";
import { CreateTweetDto } from "../dtos";
import { UserEntity } from "./user.repository";
import { ITweetRepository } from "../interfaces/tweet-repository.interface";
import { TweetType as PrismaTweetType } from "@prisma/client";

export type TweetType = PrismaTweetType;
export const TweetType = PrismaTweetType;

export interface TweetEntity {
  id: string;
  content: string;
  authorId: string;
  type: TweetType;
  createdAt: Date;
  updatedAt: Date;
  author?: UserEntity;
}

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
    // Lógica simplificada de feed
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
          type: "REPLY", // String literal compatível com o Enum
        },
      });

      await prisma.reply.create({
        data: { tweetId: replyTo, replyId: newTweetReply.id },
      });

      return newTweetReply;
    });
  }

  public async findUnique(id: string): Promise<TweetEntity | null> {
    return await prismaRepository.tweet.findUnique({
      where: { id },
    });
  }

  public async delete(id: string): Promise<TweetEntity> {
    return await prismaRepository.tweet.delete({
      where: { id },
      include: { author: true } 
    });
  } 

  public async findManyByUserId(
    userId: string,
  ): Promise<TweetEntity[]> {
    return await prismaRepository.tweet.findMany({
      where: { type: "NORMAL", authorId: userId },
      orderBy: { createdAt: "desc" },
    });
  }

  public async findAll(): Promise<TweetEntity[]> {
    return await prismaRepository.tweet.findMany({
      include: { author: true }
    });
  }

  public async create(dto: CreateTweetDto): Promise<TweetEntity> {
    return await prismaRepository.tweet.create({
      data: {
        content: dto.content,
        authorId: dto.authorId,
        type: "NORMAL", 
      },
      include: { author: true } 
    });
  }
}