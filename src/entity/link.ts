import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
  OneToMany
} from "typeorm";
import { LinkVisit } from "./linkVisit";

@Entity({
  name: "links"
})
export class Link {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar")
  user_id: string;

  @Column("varchar")
  @Index({ unique: true })
  public_id: string;

  @Column("varchar")
  @Index({ unique: true })
  playlist_id: string;

  @Column("varchar")
  name: string;

  @Column("boolean")
  is_active: boolean;

  @CreateDateColumn()
  created_at: string;

  @OneToMany(type => LinkVisit, linkVisit => linkVisit.link)
  visits: LinkVisit[];
}
