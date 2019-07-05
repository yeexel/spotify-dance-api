import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateRecommendationsTable1562234851431 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "recommendations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "spotify_id" character varying NOT NULL, "track_name" character varying NOT NULL, "track_duration" integer NOT NULL, "preview_url" character varying NOT NULL, "artists" jsonb NOT NULL, "available_markets" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_23a8d2db26db8cabb6ae9d6cd87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "playlists" ADD "discover_include" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "playlists" DROP COLUMN "discover_include"`);
        await queryRunner.query(`DROP TABLE "recommendations"`);
    }

}
