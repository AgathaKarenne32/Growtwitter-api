export interface CreateUserDto {
  name: string;
  username: string;
  email: string;
  password: string;
  imageUrl?: string;
}

export interface ToogleFollow {
  followerId: string;
  followingId: string;
}
