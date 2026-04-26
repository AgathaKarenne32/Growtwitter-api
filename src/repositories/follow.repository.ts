import prismaRepository from "../database/prisma.repository";
import { UserEntity } from "./user.repository";

export interface FollowEntity {
  followerId: string;
  followingId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class FollowRepository {
  public async findUnique(
    followerId: string,
    followingId: string,
  ): Promise<FollowEntity | null> {
    return await prismaRepository.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
  }

  public async create(
    followerId: string,
    followingId: string,
  ): Promise<FollowEntity> {
    return await prismaRepository.follow.create({
      data: {
        followerId,
        followingId,
      },
    });
  }

  public async delete(followerId: string, followingId: string): Promise<void> {
    await prismaRepository.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
  }

  public async findManyFollowers(
    followingId: string,
  ): Promise<(FollowEntity & { follower: UserEntity })[]> {
    return await prismaRepository.follow.findMany({
      where: { followingId },
      orderBy: { createdAt: "desc" },
      include: { follower: true },
    });
  }

  public async findManyFollowings(
    followerId: string,
  ): Promise<(FollowEntity & { following: UserEntity })[]> {
    return await prismaRepository.follow.findMany({
      where: { followerId },
      orderBy: { createdAt: "desc" },
      include: { following: true },
    });
  }
}
