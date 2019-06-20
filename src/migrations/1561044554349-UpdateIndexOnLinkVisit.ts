import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateIndexOnLinkVisit1561044554349 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_461efbcb238ddf77989a1ceeff"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3390a0f2dc9cec6b31da488144" ON "link_visits" ("ip_address", "ua_hash") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_3390a0f2dc9cec6b31da488144"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_461efbcb238ddf77989a1ceeff" ON "link_visits" ("ua_hash") `);
    }

}
