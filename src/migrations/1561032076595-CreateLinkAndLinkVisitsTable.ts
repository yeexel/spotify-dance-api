import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateLinkAndLinkVisitsTable1561032076595 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "link_visits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ip_address" character varying NOT NULL, "ua" character varying NOT NULL, "ua_hash" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "link_id" uuid, CONSTRAINT "PK_db658eb9712f468c1b23162fef3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_461efbcb238ddf77989a1ceeff" ON "link_visits" ("ua_hash") `);
        await queryRunner.query(`CREATE TABLE "links" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "public_id" character varying NOT NULL, "playlist_id" character varying NOT NULL, "name" character varying NOT NULL, "is_active" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ecf17f4a741d3c5ba0b4c5ab4b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_301b359eb108ffc90ac9d2adea" ON "links" ("public_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d9a4f65f7638c8ff9d1bc58a4e" ON "links" ("playlist_id") `);
        await queryRunner.query(`ALTER TABLE "link_visits" ADD CONSTRAINT "FK_c54384cd076a8ae87896aa0e12f" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "link_visits" DROP CONSTRAINT "FK_c54384cd076a8ae87896aa0e12f"`);
        await queryRunner.query(`DROP INDEX "IDX_d9a4f65f7638c8ff9d1bc58a4e"`);
        await queryRunner.query(`DROP INDEX "IDX_301b359eb108ffc90ac9d2adea"`);
        await queryRunner.query(`DROP TABLE "links"`);
        await queryRunner.query(`DROP INDEX "IDX_461efbcb238ddf77989a1ceeff"`);
        await queryRunner.query(`DROP TABLE "link_visits"`);
    }

}
