"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const cors = require("@koa/cors");
const helmet = require("koa-helmet");
const bodyParser = require("koa-bodyparser");
const routes_1 = require("./routes");
const config_1 = require("./config");
require("reflect-metadata");
const typeorm_1 = require("typeorm");
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
app.use(routes_1.router.routes()).use(routes_1.router.allowedMethods());
app.use(async (ctx) => {
    if (ctx.status === 404) {
        ctx.redirect("/");
    }
});
// Heroku-specific
if (process.env.NODE_ENV === "production") {
    // TODO: enforce HTTPS
    // https://github.com/rangle/force-ssl-heroku/blob/master/force-ssl-heroku.js
    const https = require("https");
    setInterval(() => {
        console.log(`KEEP_AWAKE_REQUEST: ${Date.now()}`);
        https.get(config_1.config.apiUrl);
    }, KEEP_AWAKE_15MIN_INTERVAL);
}
typeorm_1.createConnection().then(() => {
    app.listen(config_1.config.port);
});
//# sourceMappingURL=server.js.map