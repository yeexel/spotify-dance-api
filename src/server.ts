import * as Koa from "koa";
import * as cors from "@koa/cors";
import * as helmet from "koa-helmet";
import * as bodyParser from "koa-bodyparser";

import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

import { router } from "./routes";
import { config } from "./config";

import "reflect-metadata";
import { getConnectionOptions, createConnection } from "typeorm";

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

getConnectionOptions().then(async options => {
  console.log(options);

  let dbOptions = {};

  console.log(process.env.NODE_ENV);

  if (process.env.NODE_ENV === "production") {
    dbOptions = Object.assign(options, { extra: { ssl: "Amazon RDS" } });
  }

  await createConnection();

  app.listen(config.port);
});
