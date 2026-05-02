import "express-async-errors";
import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares";
import { 
  AuthRoutes, 
  UsersRoutes, 
  TweetsRoutes, 
  LikesRoutes, 
  FollowersRoutes 
} from "./routes"; // Certifique-se de importar suas classes de rotas

class App {
  public app: express.Application;
  public port: number;

  constructor(routers: express.Router[], port: number) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(routers);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private initializeControllers(routers: express.Router[]) {
    this.app.get("/", (req, res) => res.send("Growtwitter API is running!"));
    
    routers.forEach((router) => {
    this.app.use(router); 
  });
  }

  private initializeErrorHandling() {
    this.app.use(errorHandler);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

// Criamos a lista de rotas reais chamando os métodos estáticos bind()
const routers = [
  AuthRoutes.bind(),
  UsersRoutes.bind(),
  TweetsRoutes.bind(),
  LikesRoutes.bind(),
  FollowersRoutes.bind(),
];

// Exportamos apenas a instância do express para o supertest usar
export const app = new App(routers, 3000).app; 
export default App;