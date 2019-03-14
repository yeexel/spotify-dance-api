"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UpdatePhotoFields1552488111655 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "photo" DROP COLUMN "isPublished"`);
        await queryRunner.query(`ALTER TABLE "photo" DROP COLUMN "isReported"`);
        await queryRunner.query(`ALTER TABLE "photo" ADD "is_published" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "photo" ADD "is_reported" boolean NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "photo" DROP COLUMN "is_reported"`);
        await queryRunner.query(`ALTER TABLE "photo" DROP COLUMN "is_published"`);
        await queryRunner.query(`ALTER TABLE "photo" ADD "isReported" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "photo" ADD "isPublished" boolean NOT NULL`);
    }
}
exports.UpdatePhotoFields1552488111655 = UpdatePhotoFields1552488111655;
//# sourceMappingURL=1552488111655-update_photo_fields.js.map