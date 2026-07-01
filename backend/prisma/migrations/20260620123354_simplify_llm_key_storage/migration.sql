/*
  Warnings:

  - You are about to drop the column `api_key_encrypted` on the `user_llm_settings` table. All the data in the column will be lost.
  - Added the required column `api_key` to the `user_llm_settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_llm_settings" DROP COLUMN "api_key_encrypted",
ADD COLUMN     "api_key" TEXT NOT NULL;
