export interface TweetEntity {
  id: string;
  content: string;
  authorId: string;
  type: string;
  parentTweetId?: string | null | undefined;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    email: string;
    id: string;
    name: string;
    username: string;
    imageUrl?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface ITweetRepository {
  create(data: any): Promise<TweetEntity>;
  findUnique(id: string): Promise<TweetEntity | null>;
  findUniqueWithAuthor(id: string): Promise<any>;
  findManyByUserId(userId: string): Promise<TweetEntity[]>;
  delete(id: string): Promise<TweetEntity>;
  findAll(): Promise<TweetEntity[]>;
  update(id: string, data: any): Promise<any>;
  listRepliesByTweetId(tweetId: string): Promise<any>;
  feed(userId: string): Promise<TweetEntity[]>;
  createReply(content: string, authorId: string, replyTo: string): Promise<TweetEntity>;
  listAll(page: number, perPage: number): Promise<TweetEntity[]>;
}