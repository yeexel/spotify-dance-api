import { BaseContext } from "koa";
const request = require("request-promise");
import { SPOTIFY_API_BASE_URL } from "../constants";

class SpotifyController {
  public static async account(ctx: BaseContext) {
    const user = ctx.state.user;

    delete user.access_token;
    delete user.spotify_id;
    delete user.created_at;

    ctx.body = user;
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
