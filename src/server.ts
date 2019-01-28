import * as Koa from "koa";
import * as dotenv from "dotenv";
import * as bodyParser from "koa-bodyparser";

import { config } from "./config";
import { router } from "./routes";

dotenv.config({ path: ".env" });

const app = new Koa();

app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

app.listen(config.port);
