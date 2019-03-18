import { BaseContext } from "koa";
const request = require("request-promise");
import { SPOTIFY_API_BASE_URL } from "../constants";
import { createConnection } from "typeorm";
import { User } from "../entity/user";

class SpotifyController {
  public static async account(ctx: BaseContext) {
    const accountData = await request(
      requestSpotifyApi("me", ctx.state.user.access_token)
    );

    ctx.body = accountData;
  }
}

const requestSpotifyApi = (endpoint: string, token: string): object => ({
  method: "GET",
  uri: `${SPOTIFY_API_BASE_URL}/${endpoint}`,
  headers: {
    Authorization: `Bearer ${token}`
  },
  json: true
});

export { SpotifyController, requestSpotifyApi };
