import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1553001355483 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spotify_id" character varying NOT NULL, "access_token" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "subscription" character varying NOT NULL, "country" character varying(2) NOT NULL, "followers" integer NOT NULL, "avatar_url" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
