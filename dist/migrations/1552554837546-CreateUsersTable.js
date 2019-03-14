"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CreateUsersTable1552554837546 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstname" character varying(100) NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
exports.CreateUsersTable1552554837546 = CreateUsersTable1552554837546;
//# sourceMappingURL=1552554837546-CreateUsersTable.js.map