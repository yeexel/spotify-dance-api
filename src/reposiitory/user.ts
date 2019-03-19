import { User } from "../entity/user";
import { Repository, EntityRepository } from "typeorm";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  getBySpotifyId(id: string) {
    return this.findOne({ where: { spotify_id: id } });
  }

  async getBySpotifyIdOrCreate(id: string, data: any) {
    let user = await this.getBySpotifyId(id);

    if (!user) {
      user = this.create();
      user.spotify_id = data.id;
      user.access_token = data.access_token;
      user.name = data.display_name;
      user.email = data.email;
      user.subscription = data.product;
      user.country = data.country;
      user.followers = data.followers.total;
      user.avatar_url = data.images.length ? data.images[0].url : undefined;

      await this.save(user);

      user = await this.getBySpotifyId(id);
    } else { // update access token for existing user on login
      user.access_token = data.access_token;

      await this.save(user);
    }

    return user;
  }
}
