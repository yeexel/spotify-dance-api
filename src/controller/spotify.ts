import { BaseContext } from "koa";
const request = require("request-promise");
import { SPOTIFY_API_BASE_URL } from "../constants";
import { getCustomRepository, QueryFailedError } from "typeorm";
import { PlaylistRepository } from "../reposiitory/playlist";
import { PlaylistStats } from "../helpers/playlistStats";
import { LinkRepository } from "../reposiitory/link";
import { LinkVisit } from "../entity/linkVisit";
import * as crypto from "crypto";
import { LinkVisitRepository } from "../reposiitory/linkVisit";

class SpotifyController {
  public static async account(ctx: BaseContext) {
    const user = ctx.state.user;

    delete user.access_token;
    delete user.spotify_id;
    delete user.created_at;
    delete user.email;
    delete user.subscription;

    ctx.body = user;
  }

  public static async playlists(ctx: BaseContext) {
    const limit = ctx.query.limit || 20;
    const offset = ctx.query.offset || 0;

    const playlistData = await request(
      requestSpotifyApi(
        `users/${
          ctx.state.user.spotify_id
        }/playlists?limit=${limit}&offset=${offset}`,
        ctx.state.user.access_token
      )
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
      const stats = new PlaylistStats(
        spotifyPlaylist.id,
        ctx.state.user.access_token
      );

      playlistDataToReturn = await playlistRepository.getBySpotifyId(
        spotifyPlaylist.id
      );

      if (!playlistDataToReturn) {
        const statsParsed: any = await stats.retrieve();

        playlistDataToReturn = await playlistRepository.createPlaylist(
          spotifyPlaylist.id,
          ctx.state.user.id,
          {
            ...spotifyPlaylist,
            duration_ms: statsParsed.duration_ms,
            danceability: statsParsed.danceability,
            energy: statsParsed.energy,
            valence: statsParsed.valence,
            tempo: statsParsed.tempo_avg
          }
        );
      }

      if (spotifyPlaylist.tracks.total !== playlistDataToReturn.tracks) {
        const statsParsed2: any = await stats.retrieve();

        await playlistRepository.save({
          ...playlistDataToReturn,
          duration_ms: statsParsed2.duration_ms,
          danceability: statsParsed2.danceability,
          tracks: statsParsed2.tracks,
          energy: statsParsed2.energy,
          valence: statsParsed2.valence,
          tempo: statsParsed2.tempo_avg
        });

        playlistDataToReturn = await playlistRepository.getBySpotifyId(
          spotifyPlaylist.id
        );
      }

      if (spotifyPlaylist.followers.total !== playlistDataToReturn.followers) {
        await playlistRepository.save({
          ...playlistDataToReturn,
          followers: spotifyPlaylist.followers.total
        });

        playlistDataToReturn = await playlistRepository.getBySpotifyId(
          spotifyPlaylist.id
        );
      }

      if (spotifyPlaylist.images[0].url !== playlistDataToReturn.cover_image) {
        await playlistRepository.save({
          ...playlistDataToReturn,
          cover_image: spotifyPlaylist.images[0].url
        });

        playlistDataToReturn = await playlistRepository.getBySpotifyId(
          spotifyPlaylist.id
        );
      }

      if (spotifyPlaylist.description !== playlistDataToReturn.description) {
        await playlistRepository.save({
          ...playlistDataToReturn,
          description: spotifyPlaylist.description
        });

        playlistDataToReturn = await playlistRepository.getBySpotifyId(
          spotifyPlaylist.id
        );
      }

      if (spotifyPlaylist.name !== playlistDataToReturn.name) {
        await playlistRepository.save({
          ...playlistDataToReturn,
          name: spotifyPlaylist.name
        });

        playlistDataToReturn = await playlistRepository.getBySpotifyId(
          spotifyPlaylist.id
        );
      }
    }

    ctx.body = playlistDataToReturn;
  }

  public static async analyzePlaylist(ctx: BaseContext) {
    const playlistId = ctx.query.id || undefined;

    const playlistStats = new PlaylistStats(
      playlistId,
      ctx.state.user.access_token
    );

    const response = await playlistStats.retrieve();

    ctx.body = response;
  }

  public static async getPlaylistFromLink(ctx: BaseContext) {
    const playlistRepository = getCustomRepository(PlaylistRepository);
    const linkRepository = getCustomRepository(LinkRepository);

    const { publicLinkId } = ctx.params;

    const link = await linkRepository.findOne({
      where: { public_id: publicLinkId }
    });

    if (!link || !link.is_active) {
      ctx.status = 422;
      ctx.res.end(
        JSON.stringify({
          error: true,
          msg: "Link is invalid."
        })
      );
    }

    let playlist = null;

    try {
      playlist = await playlistRepository.findOne(link.playlist_id);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        ctx.status = 422;
        ctx.res.end(
          JSON.stringify({
            error: true,
            msg: "Playlist data is not available."
          })
        );
      }
    }

    // add tracking
    const linkVisitRepository = getCustomRepository(LinkVisitRepository);
    const linkVisit = new LinkVisit();

    const ip =
      ctx.req.headers && ctx.req.headers["x-forwarded-for"]
        ? ctx.req.headers["x-forwarded-for"]
        : ctx.req.connection.remoteAddress;

    const ua =
      ctx.req.headers && ctx.req.headers["user-agent"]
        ? ctx.req.headers["user-agent"]
        : "";

    const uaHash = crypto
      .createHash("md5")
      .update(ua)
      .digest("hex");

    linkVisit.ip_address = ip;
    linkVisit.ua = ua;
    linkVisit.playlist_id = playlist.id;
    linkVisit.ua_hash = uaHash;
    linkVisit.link = link;

    try {
      console.log("Saving visit...");
      linkVisitRepository.save(linkVisit);
    } catch (e) {}

    ctx.body = playlist;
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
