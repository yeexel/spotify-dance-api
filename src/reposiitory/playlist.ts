import { Playlist } from "../entity/playlist";
import { Repository, EntityRepository } from "typeorm";

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

    await this.save(playlist);

    playlist = await this.getBySpotifyId(spotifyId);

    return playlist;
  }
}
