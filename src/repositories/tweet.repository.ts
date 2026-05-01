import prismaRepository from "../database/prisma.repository";
import { CreateTweetDto } from "../dtos";
import { UserEntity } from "./user.repository";
import { ITweetRepository } from "../interfaces/tweet-repository.interface";
import { TweetType as PrismaTweetType } from "@prisma/client";

// Usamos o enum do Prisma para evitar conflitos de atribuição
export type TweetType = PrismaTweetType;

export interface TweetEntity {
  id: string;
  content: string;
  authorId: string;
  type: TweetType;
  createdAt: Date;
  updatedAt: Date;
  author?: UserEntity;
}

export class TweetRepository implements ITweetRepository {
  public async create(
    dto: CreateTweetDto,
  ): Promise<TweetEntity & { author: UserEntity }> {
    return await prismaRepository.tweet.create({
      data: { content: dto.content, authorId: dto.authorId },
      include: { author: true },
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

  public async delete(id: string): Promise<void> {
    await prismaRepository.tweet.delete({
      where: { id },
    });
    // Removido o return para satisfazer Promise<void>
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
}