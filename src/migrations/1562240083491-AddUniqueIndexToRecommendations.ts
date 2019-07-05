import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUniqueIndexToRecommendations1562240083491 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d324f3c0f670b1e51732b76d7f" ON "recommendations" ("user_id", "spotify_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_d324f3c0f670b1e51732b76d7f"`);
    }

}
