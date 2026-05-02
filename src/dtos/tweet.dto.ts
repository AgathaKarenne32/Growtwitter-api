import { TweetType } from "../models";

export interface CreateTweetDto {
  type?: TweetType;
  parentTweetId?: string;
  authorId: string;
  content: string;
}
export interface UpdateTweetDto {
  authorId: string;
  tweetId: string;
  content: string;
  type?: TweetType;          
  parentTweetId?: string;   
}

export type CreateReplyDto = CreateTweetDto & {
  replyTo: string;
};

export interface UpdateTweetDto extends CreateTweetDto {
  tweetId: string;
}

export interface FindTweetDto {
  tweetId: string;
}

export interface DeleteTweetDto extends FindTweetDto {
  authorId: string;
}
