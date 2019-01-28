import { BaseContext } from "koa";
import { config } from "../config";
import * as querystring from "query-string";
import { createGzip } from "zlib";

const RANDOM_STRING_LENGTH = 7;
const SPOTIFY_STATE_KEY = "spotify_state_key";

export default class AuthController {
  public static async spotifyLogin(ctx: BaseContext) {
    const state = generateRandomString();

    ctx.cookies.set(SPOTIFY_STATE_KEY, state);

    const scope = "user-read-private user-read-email";

    const spotifyAuthorizeUrl =
      "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: config.spotifyClientId,
        scope,
        redirect_uri: "http://localhost:3000/callback/",
        state
      });

    ctx.body = {
      uri: spotifyAuthorizeUrl
    };
  }

  public static async spotifyCallback(ctx: BaseContext) {
    const code = ctx.request.code || null;
    const state = ctx.request.state || null;
    const storedState = ctx.ccokies.get(SPOTIFY_STATE_KEY);

    if (state === null || state !== storedState) {
      console.log("ERROR");
      ctx.redirect("http://www.google.com");
    } else {
    }
  }
}

const generateRandomString = (
  length: number = RANDOM_STRING_LENGTH
): string => {
  let text = "";
  const variations =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += variations.charAt(Math.floor(Math.random() * variations.length));
  }

  return text;
};
