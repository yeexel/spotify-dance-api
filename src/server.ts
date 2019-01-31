import * as Koa from "koa";
import * as cors from "@koa/cors";
import * as helmet from "koa-helmet";
import * as bodyParser from "koa-bodyparser";

import { config } from "./config";
import { router } from "./routes";

const KEEP_AWAKE_15MIN_INTERVAL = 900000;

const app = new Koa();

app.use(helmet());
app.use(cors());

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

app.use(async ctx => {
  if (ctx.status === 404) {
    ctx.redirect("/");
  }
});

app.listen(config.port);

// Heroku-specific
if (process.env.NODE_ENV === "production") {
  const http = require("http");
  setInterval(() => {
    console.log(`KEEP_AWAKE_REQUEST: ${Date.now()}`);
    http.get(config.apiUrl);
  }, KEEP_AWAKE_15MIN_INTERVAL);
}
