import * as Koa from "koa";
import * as cors from "@koa/cors";
import * as helmet from "koa-helmet";
import * as bodyParser from "koa-bodyparser";

import { router } from "./routes";
import { config } from "./config";

import "reflect-metadata";
import { createConnection } from "typeorm";

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

createConnection({
  type: "postgres",
  url: config.databaseUrl,
  entities:
    config.nodeEnv === "dev" ? ["src/entity/**/*.ts"] : ["dist/entity/**/*.js"],
  migrations:
    config.nodeEnv === "dev"
      ? ["src/migrations/**/*.ts"]
      : ["dist/migrations/**/*.js"],
  cli: {
    migrationsDir:
      config.nodeEnv === "dev" ? "src/migrations" : "dist/migrations"
  }
}).then(() => {
  app.listen(config.port);
});
