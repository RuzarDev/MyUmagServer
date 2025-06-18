import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCustomerDeleteBehavior1623121231234 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Удаляем старое ограничение
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_59fadea46c0451b6663017f4c51";`);

        // Добавляем новое ограничение с поведением на обнуление
        await queryRunner.query(`
            ALTER TABLE "orders"
            ADD CONSTRAINT "FK_customerId"
            FOREIGN KEY ("customerId")
            REFERENCES "customers"("id")
            ON DELETE SET NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // В случае отката миграции удалим новое ограничение и вернем старое
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_customerId";`);
        await queryRunner.query(`
            ALTER TABLE "orders"
            ADD CONSTRAINT "FK_59fadea46c0451b6663017f4c51"
            FOREIGN KEY ("customerId")
            REFERENCES "customers"("id")
            ON DELETE CASCADE;
        `);
    }
}
