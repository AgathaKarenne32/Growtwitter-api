import "express-async-errors";
import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares";
import router from "./routes"; 

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private initializeRoutes() {
    this.app.get("/", (req, res) => res.send("Growtwitter API is running!"));
    
    this.app.use(router); 
  }

  private initializeErrorHandling() {
    this.app.use(errorHandler);
  }

  public listen(port: number) {
    this.app.listen(port, () => {
      console.log(`App listening on the port ${port}`);
    });
  }
}

export const appInstance = new App();
export const app = appInstance.app;
export default App;