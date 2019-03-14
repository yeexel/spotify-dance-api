"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Yes1552487456197 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "photo" ADD "isReported" boolean NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "photo" DROP COLUMN "isReported"`);
    }
}
exports.Yes1552487456197 = Yes1552487456197;
//# sourceMappingURL=1552487456197-Yes.js.map