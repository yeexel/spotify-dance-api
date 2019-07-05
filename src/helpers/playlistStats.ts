const request = require("request-promise");
import { SPOTIFY_API_BASE_URL } from "../constants";

class PlaylistStats {
  playlistId: string;
  accessToken: string;

  constructor(playlistId, accessToken) {
    this.playlistId = playlistId;
    this.accessToken = accessToken;
  }

  // attrs we can use to define filters for playlist
  // long play, high tempo, energetic, acoustic/instrumental, dance, happy, sad, work
  async retrieve() {
    const playlistTracksData = await request(
      requestSpotifyApi(
        `playlists/${this.playlistId}/tracks?limit=100`,
        this.accessToken
      )
    );

    const totalTracks = playlistTracksData.total;
    const tracksIds = playlistTracksData.items.map(track => track.track.id);

    let danceability = 0;
    let duration = 0;
    let tempo = 0;
    let valence = 0;
    let energy = 0;
    let instrumentalness = 0;
    let acousticness = 0;

    if (tracksIds.length) {
      const audioFeatures: any = await request(
        requestSpotifyApi(
          `audio-features?ids=${tracksIds.join(",")}`,
          this.accessToken
        )
      );

      if (totalTracks <= 100) {
        const totalDanceability = audioFeatures.audio_features.reduce(
          (acc, af) => (af ? (acc += af.danceability) : 0),
          0
        );
        const totalTempo = audioFeatures.audio_features.reduce(
          (acc, af) => (af ? (acc += af.tempo) : 0),
          0
        );
        const totalValence = audioFeatures.audio_features.reduce(
          (acc, af) => (af ? (acc += af.valence) : 0),
          0
        );
        const totalEnergy = audioFeatures.audio_features.reduce(
          (acc, af) => (af ? (acc += af.energy) : 0),
          0
        );
        const totalInstrumentalness = audioFeatures.audio_features.reduce(
          (acc, af) => (af ? (acc += af.instrumentalness) : 0),
          0
        );
        const totalAcousticness = audioFeatures.audio_features.reduce(
          (acc, af) => (af ? (acc += af.acousticness) : 0),
          0
        );

        danceability = totalDanceability / +tracksIds.length;
        tempo = totalTempo / +tracksIds.length;
        valence = totalValence / +tracksIds.length;
        energy = totalEnergy / +tracksIds.length;
        instrumentalness = totalInstrumentalness / tracksIds.length;
        acousticness = totalAcousticness / tracksIds.length;
        duration = audioFeatures.audio_features.reduce(
          (acc, af) => (af ? (acc += af.duration_ms) : 0),
          0
        );
      }
    }

    return {
      danceability: totalTracks > 100 ? -1 : Math.ceil(danceability * 100),
      tempo_avg: totalTracks > 100 ? -1 : Math.ceil(tempo),
      valence: totalTracks > 100 ? -1 : Math.ceil(valence * 100),
      energy: totalTracks > 100 ? -1 : Math.ceil(energy * 100),
      instrumentalness:
        totalTracks > 100 ? -1 : Math.ceil(instrumentalness * 100),
      acousticness: totalTracks > 100 ? -1 : Math.ceil(acousticness * 100),
      duration_ms: totalTracks > 100 ? -1 : duration,
      tracks: totalTracks
    };
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
