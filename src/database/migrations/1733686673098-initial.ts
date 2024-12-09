import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1733686673098 implements MigrationInterface {
  name = 'Initial1733686673098';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`company\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, INDEX \`email_index\` (\`email\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_company\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` varchar(36) NOT NULL, \`userId\` varchar(255) NOT NULL, \`companyId\` varchar(255) NOT NULL, INDEX \`userId_index\` (\`userId\`), UNIQUE INDEX \`userId_companyId_index\` (\`userId\`, \`companyId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_company\` ADD CONSTRAINT \`FK_2f89aead53ebdaaf3dca910ed56\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_company\` ADD CONSTRAINT \`FK_9c279d6cf291c858efa8a6b143f\` FOREIGN KEY (\`companyId\`) REFERENCES \`company\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_company\` DROP FOREIGN KEY \`FK_9c279d6cf291c858efa8a6b143f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_company\` DROP FOREIGN KEY \`FK_2f89aead53ebdaaf3dca910ed56\``,
    );
    await queryRunner.query(
      `DROP INDEX \`userId_companyId_index\` ON \`user_company\``,
    );
    await queryRunner.query(`DROP INDEX \`userId_index\` ON \`user_company\``);
    await queryRunner.query(`DROP TABLE \`user_company\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(`DROP INDEX \`email_index\` ON \`user\``);
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`company\``);
  }
}
