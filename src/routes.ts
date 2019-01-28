import * as Router from "koa-router";
import controller = require("./controller");

const router = new Router();

router.get("/login", controller.auth.spotifyLogin);
router.get("/callback", controller.auth.spotifyCallback);

export { router };
