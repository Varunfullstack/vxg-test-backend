import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedUserTable1725626923931 implements MigrationInterface {
    name = 'UpdatedUserTable1725626923931'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`name\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`name\``);
    }

}
