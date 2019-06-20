import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateIndexOnLinkVisitV21561044864328 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_3390a0f2dc9cec6b31da488144"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_128de3a88f26664d296b5a1ceb" ON "link_visits" ("ip_address", "ua_hash", "id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_128de3a88f26664d296b5a1ceb"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3390a0f2dc9cec6b31da488144" ON "link_visits" ("ip_address", "ua_hash") `);
    }

}
