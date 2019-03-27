import {MigrationInterface, QueryRunner} from "typeorm";

export class AddEnergyAndValenceToPlaylist1553697166716 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "playlists" ADD "energy" smallint`);
        await queryRunner.query(`ALTER TABLE "playlists" ADD "valence" smallint`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "playlists" DROP COLUMN "valence"`);
        await queryRunner.query(`ALTER TABLE "playlists" DROP COLUMN "energy"`);
    }

}
