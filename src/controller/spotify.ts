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

  public static async playlists(ctx: BaseContext) {
    const limit = ctx.query.limit || 20;
    const offset = ctx.query.offset || 0;

    const playlistData = await request(
      requestSpotifyApi(`users/${ctx.state.user.spotify_id}/playlists?limit=${limit}&offset=${offset}`, ctx.state.user.access_token)
    );

    ctx.body = playlistData;
  }

  public static async playlist(ctx: BaseContext) {
    const playlistId = ctx.query.id || undefined;

    const singlePlaylistData = await request(
      requestSpotifyApi(`playlists/${playlistId}`, ctx.state.user.access_token)
    );

    singlePlaylistData.created_by_user = singlePlaylistData.owner.display_name === ctx.state.user.name;
    // placeholder
    singlePlaylistData.danceability = -1;

    ctx.body = singlePlaylistData;
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
