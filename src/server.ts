import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";

import { config } from "./config";
import { router } from "./routes";

const app = new Koa();

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
