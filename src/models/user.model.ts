import { Tweet, TweetDto } from ".";

export interface UserDto {
  id: string;
  name: string;
  imageUrl: string | null;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  password?: string;
  tweets?: TweetDto[];
  followers?: UserDto[];
  following?: UserDto[];
}

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly imageUrl: string | null,
    public readonly username: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    private _password?: string, // Usei _ para diferenciar do getter
    private _tweets?: Tweet[],
    private _followers?: User[],
    private _following?: User[],
  ) { }

  public get password(): string | undefined {
    return this._password;
  }

  public withTweets(tweets: Tweet[]) {
    this._tweets = tweets;
    return this;
  }

  public withFollowers(followers: User[]) {
    this._followers = followers;
    return this;
  }

  public withFollowing(following: User[]) {
    this._following = following;
    return this;
  }

  public withPassword(password: string) {
    this._password = password;
    return this;
  }

  public toJSON(): UserDto {
    return {
      id: this.id,
      name: this.name,
      imageUrl: this.imageUrl,
      username: this.username,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      password: this._password,
      tweets: this._tweets?.map((t) => t.toJSON()),
      followers: this._followers?.map((u) => u.toJSON()),
      following: this._following?.map((u) => u.toJSON()),
    };
  }
}