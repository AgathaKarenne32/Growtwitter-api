import prismaRepository from "../database/prisma.repository";
import { CreateLikeDto } from "../dtos";
import { UserEntity } from "./user.repository";

export interface LikeEntity {
  tweetId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  author?: UserEntity;
}

export class LikeRepository {
  public async findManyByTweetId(
    tweetId: string,
  ): Promise<(LikeEntity & { author: UserEntity })[]> {
    return await prismaRepository.like.findMany({
      where: { tweetId },
      include: { author: true },
    });
  }

  public async findUnique(
    tweetId: string,
    authorId: string,
  ): Promise<LikeEntity | null> {
    return await prismaRepository.like.findUnique({
      where: {
        tweetId_authorId: {
          tweetId,
          authorId,
        },
      },
    });
  }

  public async create(
    dto: CreateLikeDto,
  ): Promise<LikeEntity & { author: UserEntity }> {
    return await prismaRepository.like.create({
      data: { authorId: dto.authorId, tweetId: dto.tweetId },
      include: { author: true },
    });
  }

  public async delete(tweetId: string, authorId: string): Promise<void> {
    await prismaRepository.like.delete({
      where: {
        tweetId_authorId: {
          authorId,
          tweetId,
        },
      },
    });
  }
}
