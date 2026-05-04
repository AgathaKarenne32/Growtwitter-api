import "dotenv/config";
import App from "./app";
import router from "./routes";
import { envs } from "./envs";
import 'dotenv/config';
const app = new App();

app.listen(envs.PORT);