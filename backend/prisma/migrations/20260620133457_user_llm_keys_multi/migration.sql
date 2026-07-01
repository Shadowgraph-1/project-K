/*
  Warnings:

  - You are about to drop the `user_llm_settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_llm_settings" DROP CONSTRAINT "user_llm_settings_user_id_fkey";

-- DropTable
DROP TABLE "user_llm_settings";

-- CreateTable
CREATE TABLE "user_llm_keys" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" INTEGER NOT NULL,
    "label" VARCHAR(64),
    "api_key" TEXT NOT NULL,
    "key_hint" VARCHAR(8),
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_llm_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_llm_keys_user_id_idx" ON "user_llm_keys"("user_id");

-- AddForeignKey
ALTER TABLE "user_llm_keys" ADD CONSTRAINT "user_llm_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
