import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity({
  name: "playlists"
})
export class Playlist {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar")
  user_id: string;

  @Column("varchar")
  spotify_id: string;

  @Column("varchar")
  name: string;

  @Column("varchar")
  cover_image: string;

  @Column()
  description: string;

  @Column()
  uri: string;

  @Column("varchar", {
    nullable: true
  })
  owner: string;

  @Column("int", {
    nullable: true
  })
  followers: number;

  @Column("smallint")
  tracks: number;

  @Column("int")
  duration_ms: number;

  @Column("smallint")
  danceability: number;

  @Column("smallint", { nullable: true })
  energy: number;

  @Column("smallint", { nullable: true })
  valence: number;

  @Column("smallint", { nullable: true })
  tempo: number;

  @Column("boolean", { default: false })
  discover_include: boolean;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
