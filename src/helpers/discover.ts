const request = require("request-promise");
import { SPOTIFY_API_BASE_URL } from "../constants";

/**
 * Retrieve list of a user's top artists and tracks for the last 4 weeks.
 *
 * Grab 5 artists and 5 tracks and provide them as seeds to recommendation API.
 *
 * Calculate medium danceability, tempo, energy and valence.
 *
 * Pass those parameters to recommendation API.
 */

const TIME_RANGE_SHORT = "short_term";
const TIME_RANGE_MEDIUM = "medium_term";
const TIME_RANGE_LONG = "long_term";

const LIMIT_TOP = 15;
const TYPE_TRACK = "tracks";
const TYPE_ARTIST = "artists";

const ENERGY_MAX_STEP = 7;
const ENERGY_MIN_STEP = 3;

const VALENCE_MAX_STEP = 10;
const VALENCE_MIN_STEP = 5;

const DANCEABILITY_MAX_STEP = 7;
const DANCEABILITY_MIN_STEP = 4;

const TEMPO_MAX_STEP = 0;
const TEMPO_MIN_STEP = 0;

class DiscoverHelper {
  userId: string;
  token: string;

  constructor(userId: string, token: string) {
    this.userId = userId;
    this.token = token;
  }

  async getTopByType(
    type: string,
    timeRange = TIME_RANGE_MEDIUM,
    limit = LIMIT_TOP
  ) {
    const data: any = await request(
      requestSpotifyApi(
        `me/top/${type}?limit=${limit}&time_range=${timeRange}`,
        this.token
      )
    );

    return data.items.map(item => item.id);
  }

  async generate(avgData: any, limit = 30) {
    const topArtists = await this.getTopByType(TYPE_ARTIST, TIME_RANGE_MEDIUM);
    const topTracks = await this.getTopByType(TYPE_TRACK, TIME_RANGE_SHORT);

    let {
      avg_energy: energy,
      avg_valence: valence,
      avg_danceability: danceability
    } = avgData;

    // tempo = prepareAvgItem(tempo, TEMPO_MIN_STEP, TEMPO_MAX_STEP);
    energy = prepareAvgItem(energy, ENERGY_MIN_STEP, ENERGY_MAX_STEP);
    valence = prepareAvgItem(valence, VALENCE_MIN_STEP, VALENCE_MAX_STEP);
    danceability = prepareAvgItem(
      danceability,
      DANCEABILITY_MIN_STEP,
      DANCEABILITY_MAX_STEP
    );

    const recommendations: any = await request(
      requestSpotifyApi(
        `recommendations?limit=${limit}&seed_artists=${pickRandom(
          topArtists
        ).join(",")}&seed_tracks=${pickRandom(topTracks).join(
          ","
        )}&min_danceability=${danceability.min}&max_danceability=${
          danceability.max
        }&min_energy=${energy.min}&max_energy=${energy.max}&target_tempo=${
          avgData.avg_tempo
        }`,
        this.token
      )
    );

    return recommendations.tracks.map(recommendedTrack => ({
      user_id: this.userId,
      spotify_id: recommendedTrack.id,
      track_name: recommendedTrack.name,
      track_duration: recommendedTrack.duration_ms,
      preview_url: recommendedTrack.preview_url
        ? recommendedTrack.preview_url
        : "no-preview-url",
      artists: recommendedTrack.artists,
      available_markets: recommendedTrack.available_markets
    }));
  }
}

const prepareAvgItem = (valueIn, minIn, maxIn) => {
  let valueMin = valueIn;
  let valueMax = valueIn;

  valueMax = parseInt(valueMax) + parseInt(maxIn);

  if (valueMin > minIn) {
    valueMin -= minIn;
  }

  if (valueMax > 100) {
    valueMax = 100;
  }

  return {
    min: valueMin / 100,
    max: valueMax / 100
  };
};

const requestSpotifyApi = (endpoint: string, token: string): object => ({
  method: "GET",
  uri: `${SPOTIFY_API_BASE_URL}/${endpoint}`,
  headers: {
    Authorization: `Bearer ${token}`
  },
  json: true
});

const pickRandom = (inArray: Array<string>, take: number = 2) =>
  inArray.sort(() => 0.5 - Math.random()).slice(0, take);

export { DiscoverHelper };
