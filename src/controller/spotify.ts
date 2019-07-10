import { BaseContext } from "koa";
const request = require("request-promise");
import { SPOTIFY_API_BASE_URL } from "../constants";
import {
  getCustomRepository,
  QueryFailedError,
  createQueryBuilder
} from "typeorm";
import { PlaylistRepository } from "../reposiitory/playlist";
import { RecommendationRepository } from "../reposiitory/recommendation";
import { PlaylistStats } from "../helpers/playlistStats";
import { DiscoverHelper } from "../helpers/discover";
import { LinkRepository } from "../reposiitory/link";
import { LinkVisit } from "../entity/linkVisit";
import * as crypto from "crypto";
import { LinkVisitRepository } from "../reposiitory/linkVisit";
import { Recommendation } from "../entity/recommendation";

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
        spotifyPlaylist.id,
        ctx.state.user.id
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
          spotifyPlaylist.id,
          ctx.state.user.id
        );
      }

      if (spotifyPlaylist.followers.total !== playlistDataToReturn.followers) {
        await playlistRepository.save({
          ...playlistDataToReturn,
          followers: spotifyPlaylist.followers.total
        });

        playlistDataToReturn = await playlistRepository.getBySpotifyId(
          spotifyPlaylist.id,
          ctx.state.user.id
        );
      }

      if (spotifyPlaylist.images[0].url !== playlistDataToReturn.cover_image) {
        await playlistRepository.save({
          ...playlistDataToReturn,
          cover_image: spotifyPlaylist.images[0].url
        });

        playlistDataToReturn = await playlistRepository.getBySpotifyId(
          spotifyPlaylist.id,
          ctx.state.user.id
        );
      }

      if (spotifyPlaylist.description !== playlistDataToReturn.description) {
        await playlistRepository.save({
          ...playlistDataToReturn,
          description: spotifyPlaylist.description
        });

        playlistDataToReturn = await playlistRepository.getBySpotifyId(
          spotifyPlaylist.id,
          ctx.state.user.id
        );
      }

      if (spotifyPlaylist.name !== playlistDataToReturn.name) {
        await playlistRepository.save({
          ...playlistDataToReturn,
          name: spotifyPlaylist.name
        });

        playlistDataToReturn = await playlistRepository.getBySpotifyId(
          spotifyPlaylist.id,
          ctx.state.user.id
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

  public static async createPlaylist(ctx: BaseContext) {
    const trackIds = ctx.request.body.trackIds;

    const newPlaylist = await request(
      requestPostSpotifyApi(
        `users/${ctx.state.user.spotify_id}/playlists`,
        ctx.state.user.access_token,
        {
          name: "Playlista.co"
        }
      )
    );

    await request(
      requestPostSpotifyApi(
        `playlists/${newPlaylist.id}/tracks`,
        ctx.state.user.access_token,
        {
          uris: trackIds.map((id: string) => `spotify:track:${id}`)
        }
      )
    );

    ctx.body = newPlaylist;
  }

  public static async discover(ctx: BaseContext) {
    const playlistRepository = getCustomRepository(PlaylistRepository);
    const recommendationRepository = getCustomRepository(
      RecommendationRepository
    );

    const discoverHelper = new DiscoverHelper(
      ctx.state.user.id,
      ctx.state.user.access_token
    );

    const playlistsCount = await playlistRepository.findAndCount({
      where: { user_id: ctx.state.user.id, discover_include: true }
    });

    if (playlistsCount[1] < 1) {
      ctx.status = 422;
      ctx.res.end(
        JSON.stringify({
          error: true,
          msg: "You should have at least one playlist marked as favorite."
        })
      );
    }

    let recommendations: any = await recommendationRepository.getCurrentDayData(
      ctx.state.user.id
    );

    const hasRecommendationsForToday = recommendations.length > 0;

    if (!hasRecommendationsForToday) {
      const avgData = await playlistRepository.getAvgStats(ctx.state.user.id);
      const data = await discoverHelper.generate(avgData);

      try {
        const insertResponse = await createQueryBuilder()
          .insert()
          .into(Recommendation)
          .values(data)
          .returning("*")
          .execute();

        recommendations = insertResponse.generatedMaps;
      } catch (e) {}
    } else {
    }

    ctx.body = {
      playlists: playlistsCount[0],
      recommendations: recommendations.map(r => ({
        id: r.id,
        spotify_id: r.spotify_id,
        track_name: r.track_name,
        track_duration: r.track_duration,
        preview_url: r.preview_url,
        artist: r.artists.map(rArtist => rArtist.name).join(", ")
      }))
    };
  }

  public static async toggleDiscover(ctx: BaseContext) {
    const playlistRepository = getCustomRepository(PlaylistRepository);

    const { id } = ctx.params;

    const playlist = await playlistRepository.findOne({
      where: { spotify_id: id }
    });

    if (playlist) {
      playlistRepository.save(
        playlistRepository.merge(playlist, {
          discover_include: !playlist.discover_include
        })
      );
    }

    ctx.body = {};
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

const requestPostSpotifyApi = (
  endpoint: string,
  token: string,
  body: any
): object => ({
  method: "POST",
  uri: `${SPOTIFY_API_BASE_URL}/${endpoint}`,
  headers: {
    Authorization: `Bearer ${token}`
  },
  body,
  json: true
});

export { SpotifyController, requestSpotifyApi };
