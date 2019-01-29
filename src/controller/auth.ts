import { BaseContext } from "koa";
import { config } from "../config";
const request = require("request-promise");
import * as querystring from "query-string";
import * as jsonwebtoken from "jsonwebtoken";
import { SPOTIFY_API_BASE_URL } from "../constants";

const RANDOM_STRING_LENGTH = 10;
const SPOTIFY_STATE_KEY = "spotskc";
const SPOTIFY_PERMISSIONS_SCOPE =
  "user-read-private user-read-email playlist-read-private playlist-read-collaborative";

export default class AuthController {
  public static async spotifyLogin(ctx: BaseContext) {
    const state = generateRandomString();

    ctx.cookies.set(SPOTIFY_STATE_KEY, state);

    ctx.body = {
      uri: prepareSpotifyAuthorizeUrl(state)
    };
  }

  public static async spotifyCallback(ctx: BaseContext) {
    const code = ctx.query.code || null;
    const state = ctx.query.state || null;
    const storedState = ctx.cookies.get(SPOTIFY_STATE_KEY);

    if (state === null || state !== storedState) {
      ctx.throw(400, "State error");
    } else {
      // clear cookie
      ctx.cookies.set(SPOTIFY_STATE_KEY, null);

      const spotifyAcessTokenData = await request(
        prepareAuthCodeRequestParams(code)
      );

      if (!spotifyAcessTokenData) {
        ctx.throw(400, "Spotify error");
      }

      const token = jsonwebtoken.sign(
        { data: spotifyAcessTokenData },
        config.jwtSecret
      );

      ctx.body = {
        token
      };
    }
  }
}

const prepareSpotifyAuthorizeUrl = (state: string) => {
  const qs = querystring.stringify({
    response_type: "code",
    client_id: config.spotifyClientId,
    scope: SPOTIFY_PERMISSIONS_SCOPE,
    redirect_uri: "http://localhost:3000/callback/",
    state
  });

  return `${SPOTIFY_API_BASE_URL}/authorize?${qs}`;
};

const prepareAuthCodeRequestParams = (code: string): object => ({
  method: "POST",
  uri: `${SPOTIFY_API_BASE_URL}/api/token`,
  form: {
    code,
    redirect_uri: "http://localhost:3000/callback/",
    grant_type: "authorization_code"
  },
  headers: {
    Authorization:
      "Basic " +
      new Buffer(
        config.spotifyClientId + ":" + config.spotifyClientSecret
      ).toString("base64")
  },
  json: true
});

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
