import prismaRepository from "../database/prisma.repository";
import { CreateTweetDto, FindTweetDto, UpdateTweetDto } from "../dtos";
import { UserEntity } from "./user.repository";

export enum TweetType {
  NORMAL = "NORMAL",
  REPLY = "REPLY"
}

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
    return await prismaRepository.$transaction(async (prisma: any) => {
      const newTweetReply = await prisma.tweet.create({
        data: {
          content,
          authorId,
          type: TweetType.REPLY,
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

  public async findUniqueWithAuthor(
    id: string,
  ): Promise<(TweetEntity & { author: UserEntity }) | null> {
    return await prismaRepository.tweet.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  public async update(
    id: string,
    content: string,
  ): Promise<TweetEntity> {
    return await prismaRepository.tweet.update({
      where: { id },
      data: { content },
    });
  }

  public async delete(id: string): Promise<TweetEntity> {
    return await prismaRepository.tweet.delete({
      where: { id },
    });
  }

  public async findManyByUserId(
    userId: string,
  ): Promise<(TweetEntity & { author: UserEntity })[]> {
    return await prismaRepository.tweet.findMany({
      where: { type: TweetType.NORMAL, authorId: userId },
      orderBy: { createdAt: "desc" },
      include: { author: true },
    });
  }

  public async feed(
    userId: string,
  ): Promise<(TweetEntity & { author: UserEntity })[]> {
    return await prismaRepository.tweet.findMany({
      where: {
        type: TweetType.NORMAL,
        author: {
          followedBy: {
            some: {
              followerId: userId,
            },
          },
        },
      },
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });
  }

  public async listRepliesByTweetId(
    tweetId: string,
  ): Promise<
    {
      reply: TweetEntity & { author: UserEntity };
    }[]
  > {
    return await prismaRepository.reply.findMany({
      where: { tweetId },
      include: { reply: { include: { author: true } } },
    });
  }
}
