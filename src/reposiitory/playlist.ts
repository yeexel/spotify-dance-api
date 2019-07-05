import { Playlist } from "../entity/playlist";
import { Repository, EntityRepository, createQueryBuilder } from "typeorm";

@EntityRepository(Playlist)
export class PlaylistRepository extends Repository<Playlist> {
  getBySpotifyId(id: string) {
    return this.findOne({ where: { spotify_id: id, active: true } });
  }

  async createPlaylist(spotifyId: string, userId: string, data: any) {
    let playlist = this.create();

    playlist.user_id = userId;
    playlist.spotify_id = spotifyId;
    playlist.name = data.name;
    playlist.cover_image = data.images[0].url;
    playlist.description = data.description;
    playlist.uri = data.uri;
    playlist.tracks = data.tracks.total;
    playlist.followers = data.followers.total;
    playlist.owner = data.owner.display_name;
    playlist.duration_ms = data.duration_ms;
    playlist.danceability = data.danceability;
    playlist.energy = data.energy;
    playlist.valence = data.valence;
    playlist.tempo = data.tempo;

    await this.save(playlist);

    playlist = await this.getBySpotifyId(spotifyId);

    return playlist;
  }

  async getAvgStats(userId: string) {
    return createQueryBuilder()
      .select([
        "FLOOR(AVG(playlists.tempo)) AS avg_tempo",
        "FLOOR(AVG(playlists.danceability)) AS avg_danceability",
        "FLOOR(AVG(playlists.energy)) AS avg_energy",
        "FLOOR(AVG(playlists.valence)) AS avg_valence"
      ])
      .from(Playlist, "playlists")
      .where("playlists.user_id = :userId", { userId })
      .andWhere("playlists.discover_include = true")
      .getRawOne();
  }
}
