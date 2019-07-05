import { BaseContext } from "koa";
import { config } from "../config";
const request = require("request-promise");
import * as querystring from "query-string";
import * as jsonwebtoken from "jsonwebtoken";
import { SPOTIFY_ACCOUNTS_BASE_URL } from "../constants";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../reposiitory/user";
import { requestSpotifyApi } from "./spotify";

const RANDOM_STRING_LENGTH = 10;
const SPOTIFY_STATE_KEY = "spotskc";
const SPOTIFY_PERMISSIONS_SCOPE =
  "user-read-private user-read-email playlist-read-private playlist-read-collaborative user-top-read playlist-modify-public";

export default class AuthController {
  public static async login(ctx: BaseContext) {
    const state = generateRandomString();

    ctx.cookies.set(SPOTIFY_STATE_KEY, state);

    ctx.redirect(prepareSpotifyAuthorizeUrl(state));
  }

  public static async callback(ctx: BaseContext) {
    const code = ctx.query.code || undefined;
    const state = ctx.query.state || undefined;
    const storedState = ctx.cookies.get(SPOTIFY_STATE_KEY);

    if (state === null || state !== storedState) {
      ctx.throw(400, "State error");
    } else {
      // clear cookie
      ctx.cookies.set(SPOTIFY_STATE_KEY, undefined);

      const spotifyAccessTokenData = await request(
        prepareAuthCodeRequestParams(code)
      );

      if (!spotifyAccessTokenData) {
        ctx.throw(400, "Spotify error");
      }

      const spotifyUser = await request(
        requestSpotifyApi("me", spotifyAccessTokenData.access_token)
      );

      const userRepository = getCustomRepository(UserRepository);
      const user = await userRepository.getBySpotifyIdOrCreate(spotifyUser.id, {
        ...spotifyUser,
        access_token: spotifyAccessTokenData.access_token
      });

      const token = jsonwebtoken.sign(
        { data: { user_id: user.id } },
        config.jwtSecret,
        { expiresIn: "50m" }
      );

      ctx.redirect(`${config.clientUrl}?auth_token=${token}`);
    }
  }
}

const prepareSpotifyAuthorizeUrl = (state: string) => {
  const qs = querystring.stringify({
    response_type: "code",
    client_id: config.spotifyClientId,
    scope: SPOTIFY_PERMISSIONS_SCOPE,
    redirect_uri: `${config.apiUrl}/callback`,
    state
  });

  return `${SPOTIFY_ACCOUNTS_BASE_URL}/authorize?${qs}`;
};

const prepareAuthCodeRequestParams = (code: string): object => ({
  method: "POST",
  uri: `${SPOTIFY_ACCOUNTS_BASE_URL}/api/token`,
  form: {
    code,
    redirect_uri: `${config.apiUrl}/callback`,
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
