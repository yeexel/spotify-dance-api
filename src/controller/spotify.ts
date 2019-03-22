import { BaseContext } from "koa";
const request = require("request-promise");
import { config } from "../config";
import { SPOTIFY_API_BASE_URL } from "../constants";
import { getCustomRepository } from "typeorm";
import { PlaylistRepository } from "../reposiitory/playlist";
import { PlaylistStats } from "../helpers/playlistStats";

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

    const playlistRepository = getCustomRepository(PlaylistRepository);

    const spotifyPlaylist = await request(
      requestSpotifyApi(`playlists/${playlistId}`, ctx.state.user.access_token)
    );

    let playlistDataToReturn: any = {};

    if (spotifyPlaylist) {
      const stats = new PlaylistStats(spotifyPlaylist.id, ctx.state.user.access_token);

      playlistDataToReturn = await playlistRepository.getBySpotifyId(spotifyPlaylist.id);

      if (!playlistDataToReturn) {
        const statsParsed: any = await stats.retrieve();

        playlistDataToReturn = await playlistRepository.createPlaylist(spotifyPlaylist.id, ctx.state.user.id, {
          ...spotifyPlaylist,
          duration_ms: statsParsed.duration_ms,
          danceability: statsParsed.danceability
        });
      }

      if (spotifyPlaylist.tracks.total !== playlistDataToReturn.tracks) {
        const statsParsed2: any = await stats.retrieve();

        await playlistRepository.save({
          ...playlistDataToReturn,
          duration_ms: statsParsed2.duration_ms,
          danceability: statsParsed2.danceability,
          tracks: statsParsed2.tracks
        });

        playlistDataToReturn = await playlistRepository.getBySpotifyId(spotifyPlaylist.id);
      }

      if (spotifyPlaylist.followers.total !== playlistDataToReturn.followers) {
        await playlistRepository.save({
          ...playlistDataToReturn,
          followers: spotifyPlaylist.followers.total
        });

        playlistDataToReturn = await playlistRepository.getBySpotifyId(spotifyPlaylist.id);
      }

      if (spotifyPlaylist.images[0].url !== playlistDataToReturn.cover_image) {
        await playlistRepository.save({
          ...playlistDataToReturn,
          cover_image: spotifyPlaylist.images[0].url
        });

        playlistDataToReturn = await playlistRepository.getBySpotifyId(spotifyPlaylist.id);
      }

      if (spotifyPlaylist.description !== playlistDataToReturn.description) {
        await playlistRepository.save({
          ...playlistDataToReturn,
          description: spotifyPlaylist.description
        });

        playlistDataToReturn = await playlistRepository.getBySpotifyId(spotifyPlaylist.id);
      }

      if (spotifyPlaylist.name !== playlistDataToReturn.name) {
        await playlistRepository.save({
          ...playlistDataToReturn,
          name: spotifyPlaylist.name
        });

        playlistDataToReturn = await playlistRepository.getBySpotifyId(spotifyPlaylist.id);
      }
    }

    ctx.body = playlistDataToReturn;
  }

  public static async analyzePlaylist(ctx: BaseContext) {
    const playlistId = ctx.query.id || undefined;

    const playlistStats = new PlaylistStats(playlistId, ctx.state.user.access_token);

    const response = await playlistStats.retrieve();

    ctx.body = response;
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
