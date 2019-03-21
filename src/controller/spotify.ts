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

  public static async analyzePlaylist(ctx: BaseContext) {
    const playlistId = ctx.query.id || undefined;

    const playlistTracksData = await request(
      requestSpotifyApi(`playlists/${playlistId}/tracks?limit=100`, ctx.state.user.access_token)
    );

    const totalTracks = playlistTracksData.items.length;
    const tracksIds = playlistTracksData.items.map(track => track.track.id);

    let danceability = 0;

    if (tracksIds.length) {
      const audioFeatures: any = await request(
        requestSpotifyApi(`audio-features?ids=${tracksIds.join(',')}`, ctx.state.user.access_token)
      );

      const totalDanceability = audioFeatures.audio_features.reduce((acc, af) => acc += af.danceability, 0);

      danceability = totalDanceability / totalTracks;
    }

    ctx.body = Math.ceil(danceability * 100);
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
