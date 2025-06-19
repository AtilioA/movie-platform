import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSearchIndexes1751234632000 implements MigrationInterface {
    name = 'AddSearchIndexes1751234632000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create index on movies.title for faster title searches
        await queryRunner.query(`CREATE INDEX "IDX_movies_title" ON "movies" (LOWER("title") varchar_pattern_ops)`);
        
        // Create index on actors.name for faster name searches
        await queryRunner.query(`CREATE INDEX "IDX_actors_name" ON "actors" (LOWER("name") varchar_pattern_ops)`);
        
        // For case-insensitive pattern matching (LIKE 'search%')
        await queryRunner.query(`CREATE INDEX "IDX_movies_title_trgm" ON "movies" USING GIN ("title" gin_trgm_ops)`);
        await queryRunner.query(`CREATE INDEX "IDX_actors_name_trgm" ON "actors" USING GIN ("name" gin_trgm_ops)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop all indexes we created
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_movies_title"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_actors_name"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_movies_title_trgm"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_actors_name_trgm"`);
    }
}
