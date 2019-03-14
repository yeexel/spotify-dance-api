"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CreateUser1552488400879 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstname" character varying(100) NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
exports.CreateUser1552488400879 = CreateUser1552488400879;
//# sourceMappingURL=1552488400879-CreateUser.js.map