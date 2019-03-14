"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const jwt_1 = require("./middleware/jwt");
const Router = require("koa-router");
const controller = require("./controller");
const { version } = require("../package.json");
const router = new Router();
exports.router = router;
const jwtMiddleware = jwt_1.default({ secret: config_1.config.jwtSecret });
router.get("/", ctx => {
    ctx.body = {
        api: "spotify-dance-api",
        version,
        ts: Date.now()
    };
});
router.get("/login", controller.auth.login);
router.get("/callback", controller.auth.callback);
router.get("/api/account", jwtMiddleware, controller.spotify.account);
//# sourceMappingURL=routes.js.map