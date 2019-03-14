"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UpdatePhoto1552486946472 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "photo" DROP COLUMN "isNice11"`);
        await queryRunner.query(`ALTER TABLE "photo" DROP COLUMN "isWaiting"`);
        await queryRunner.query(`ALTER TABLE "photo" DROP COLUMN "isBanned"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "photo" ADD "isBanned" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "photo" ADD "isWaiting" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "photo" ADD "isNice11" boolean NOT NULL`);
    }
}
exports.UpdatePhoto1552486946472 = UpdatePhoto1552486946472;
//# sourceMappingURL=1552486946472-UpdatePhoto.js.map