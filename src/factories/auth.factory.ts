import { BcryptAdapter } from "../adapters";
import { AuthController } from "../controllers";
import { UserRepository } from "../repositories/user.repository";
import {
  AuthService,
  UserService,
} from "../services";

export class AuthFactory {
  public static createController(): AuthController {
    // 1. Instancia o repositório necessário
    const userRepository = new UserRepository();

    // 2. Instancia o UserService passando APENAS o userRepository
    const userService = new UserService(userRepository);

    // 3. Configura o AuthService
    const bcryptAdapter = new BcryptAdapter();
    const authService = new AuthService(userService, bcryptAdapter);

    // 4. Retorna o Controller
    return new AuthController(authService);
  }
}