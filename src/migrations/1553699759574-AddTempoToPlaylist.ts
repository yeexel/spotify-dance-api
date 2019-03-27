import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTempoToPlaylist1553699759574 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "playlists" ADD "tempo" smallint`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "playlists" DROP COLUMN "tempo"`);
    }

}
