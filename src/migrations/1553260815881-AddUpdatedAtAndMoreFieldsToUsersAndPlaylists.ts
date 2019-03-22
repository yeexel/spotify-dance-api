import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUpdatedAtAndMoreFieldsToUsersAndPlaylists1553260815881 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "playlists" DROP COLUMN "active"`);
        await queryRunner.query(`ALTER TABLE "playlists" ADD "owner" character varying`);
        await queryRunner.query(`ALTER TABLE "playlists" ADD "followers" integer`);
        await queryRunner.query(`ALTER TABLE "playlists" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "playlists" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "playlists" DROP COLUMN "followers"`);
        await queryRunner.query(`ALTER TABLE "playlists" DROP COLUMN "owner"`);
        await queryRunner.query(`ALTER TABLE "playlists" ADD "active" boolean NOT NULL DEFAULT true`);
    }

}
