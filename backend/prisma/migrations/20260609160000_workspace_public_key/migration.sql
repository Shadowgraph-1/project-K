-- Drop unused sequence from the old project-N approach
DROP SEQUENCE IF EXISTS workspace_key_seq;

-- Rename key -> public_key
ALTER TABLE "workspaces" DROP CONSTRAINT IF EXISTS "workspaces_key_key";
ALTER TABLE "workspaces" RENAME COLUMN "key" TO "public_key";

-- Backfill legacy project-1 style keys to proj_* nanoid-like slugs
UPDATE "workspaces"
SET "public_key" = 'proj_' || lower(substr(md5(random()::text || id::text), 1, 8))
WHERE "public_key" LIKE 'project-%';

CREATE UNIQUE INDEX "workspaces_public_key_key" ON "workspaces"("public_key");
