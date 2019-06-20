import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateIndexOnLinkVisitV31561045132493 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_128de3a88f26664d296b5a1ceb"`);
        await queryRunner.query(`ALTER TABLE "link_visits" ADD "playlist_id" uuid`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4a4b5e6686133a3d8f7c5cfb26" ON "link_visits" ("ip_address", "ua_hash", "playlist_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_4a4b5e6686133a3d8f7c5cfb26"`);
        await queryRunner.query(`ALTER TABLE "link_visits" DROP COLUMN "playlist_id"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_128de3a88f26664d296b5a1ceb" ON "link_visits" ("id", "ip_address", "ua_hash") `);
    }

}
