import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { Link } from "./link";

@Entity({
  name: "link_visits"
})
@Index(["ip_address", "ua_hash"], { unique: true })
export class LinkVisit {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar")
  ip_address: string;

  @Column("varchar")
  ua: string;

  @Column("varchar")
  ua_hash: string;

  @CreateDateColumn()
  created_at: string;

  @ManyToOne(type => Link, link => link.visits)
  @JoinColumn({ name: "link_id" })
  link: Link;
}
