// Adicione o import
import { UserRepository } from "../repositories/user.repository";

// Dentro de register e login, mude para:
const userRepository = new UserRepository();
const service = new AuthService(
  new UserService(
    userRepository, // Adicionado aqui
    new TweetService(new LikeService()),
    new FollowService()
  ),
  new BcryptAdapter()
);