import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePLaylistsTable1553247935295 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "playlists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "spotify_id" character varying NOT NULL, "name" character varying NOT NULL, "cover_image" character varying NOT NULL, "description" character varying NOT NULL, "uri" character varying NOT NULL, "tracks" smallint NOT NULL, "duration_ms" integer NOT NULL, "danceability" smallint NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a4597f4189a75d20507f3f7ef0d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "playlists"`);
    }

}
