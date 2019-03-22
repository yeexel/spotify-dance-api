const request = require("request-promise");
import { SPOTIFY_API_BASE_URL } from "../constants";

class PlaylistStats {
  playlistId: string;
  accessToken: string;

  constructor(playlistId, accessToken) {
    this.playlistId = playlistId;
    this.accessToken = accessToken;
  }

  async retrieve() {
    const playlistTracksData = await request(
      requestSpotifyApi(`playlists/${this.playlistId}/tracks?limit=100`, this.accessToken)
    );

    const totalTracks = playlistTracksData.items.length;
    const tracksIds = playlistTracksData.items.map(track => track.track.id);

    let danceability = 0;
    let duration = 0;

    if (tracksIds.length) {
      const audioFeatures: any = await request(
        requestSpotifyApi(`audio-features?ids=${tracksIds.join(',')}`, this.accessToken)
      );

      if (tracksIds.length <= 99) {
        const totalDanceability = audioFeatures.audio_features.reduce((acc, af) => acc += af.danceability, 0);
        danceability = totalDanceability / totalTracks;
        duration = audioFeatures.audio_features.reduce((acc, af) => acc += af.duration_ms, 0);
      }
    }

    return {
      danceability: tracksIds.length > 99 ? -1 : Math.ceil(danceability * 100),
      duration_ms: tracksIds.length > 99 ? -1 : duration,
      // duration: parseTime(duration),
      tracks: totalTracks
    };
  }
}

function parseTime(millisec: number): object {
  // @ts-ignore
  const normalizeTime = (time: string): string => (time.length === 1) ? time.padStart(2, '0') : time;

  let seconds: string = (millisec / 1000).toFixed(0);
  let minutes: string = Math.floor(parseInt(seconds) / 60).toString();
  let hours: string = '';

  if (parseInt(minutes) > 59) {
    hours = normalizeTime(Math.floor(parseInt(minutes) / 60).toString());
    minutes = normalizeTime((parseInt(minutes) - (parseInt(hours) * 60)).toString());
  }
  seconds = normalizeTime(Math.floor(parseInt(seconds) % 60).toString());

  return {
    hours: +hours,
    minutes: +minutes,
    seconds: +seconds,
    ms: millisec
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

export { PlaylistStats };
