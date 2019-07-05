import { config } from "./config";
import jwt from "./middleware/jwt";
import * as Router from "koa-router";
import controller = require("./controller");
const { version } = require("../package.json");

const router = new Router();
const jwtMiddleware = jwt({ secret: config.jwtSecret });

router.get("/", ctx => {
  ctx.body = {
    api: "playlista-api",
    version,
    ts: Date.now()
  };
});

router.get("/login", controller.auth.login);
router.get("/callback", controller.auth.callback);

router.get("/playlist/:publicLinkId", controller.spotify.getPlaylistFromLink);

router.get("/api/account", jwtMiddleware, controller.spotify.account);

router.get("/api/playlists", jwtMiddleware, controller.spotify.playlists);
router.get("/api/playlist", jwtMiddleware, controller.spotify.playlist);
router.put(
  "/api/playlists/:id",
  jwtMiddleware,
  controller.spotify.toggleDiscover
);
router.post(`/api/playlists`, jwtMiddleware, controller.spotify.createPlaylist);
router.get("/api/discover", jwtMiddleware, controller.spotify.discover);
router.get(
  "/api/analyze-playlist",
  jwtMiddleware,
  controller.spotify.analyzePlaylist
);

router.get("/api/links", jwtMiddleware, controller.link.list);
router.post("/api/links", jwtMiddleware, controller.link.create);

export { router };
