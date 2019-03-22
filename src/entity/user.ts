import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name: "users"
})
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar")
    spotify_id: string;

    @Column()
    access_token: string;

    @Column("varchar")
    name: string;

    @Column("varchar")
    email: string;

    @Column("varchar")
    subscription: string;

    @Column({ length: 2 })
    country: string;

    @Column("int")
    followers: number;

    @Column("varchar")
    avatar_url: string;

    @CreateDateColumn()
    created_at: string;

    @UpdateDateColumn()
    updated_at: string;
}
