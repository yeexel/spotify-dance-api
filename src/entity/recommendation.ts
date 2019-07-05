import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index
} from "typeorm";

@Entity({
  name: "recommendations"
})
@Index(["user_id", "spotify_id"], { unique: true })
export class Recommendation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar")
  user_id: string;

  @Column("varchar")
  spotify_id: string;

  @Column("varchar")
  track_name: string;

  @Column("int")
  track_duration: number;

  @Column("varchar")
  preview_url: string;

  @Column("jsonb")
  artists: object;

  @Column("jsonb")
  available_markets: object;

  @CreateDateColumn()
  created_at: string;
}
