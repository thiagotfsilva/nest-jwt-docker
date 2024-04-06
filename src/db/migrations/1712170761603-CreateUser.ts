import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUser1712170761603 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
            length: '120',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
            length: '320',
          },
          {
            name: 'description',
            type: 'varchar',
            length: '420',
          },
          {
            name: 'password',
            type: 'char',
            length: '60',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
