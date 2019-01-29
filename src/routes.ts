import { config } from "./config";
import jwt from "./middleware/jwt";
import * as Router from "koa-router";
import controller = require("./controller");

const router = new Router();
const jwtMiddleware = jwt({ secret: config.jwtSecret });

router.get("/", ctx => {
  ctx.body = {
    api: "spotify-dance-api",
    version: process.env.npm_package_version,
    ts: Date.now()
  };
});

router.get("/login", controller.auth.spotifyLogin);
router.get("/callback", controller.auth.spotifyCallback);

router.get("/test", jwtMiddleware, controller.spotify.testToken);

export { router };
