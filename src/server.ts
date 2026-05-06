import "dotenv/config";
import App from "./app";
import router from "./routes";
import { envs } from "./envs";
import 'dotenv/config';
import { AuthRoutes } from "./routes/auth.routes";
const app = new App();

app.listen(envs.PORT);
