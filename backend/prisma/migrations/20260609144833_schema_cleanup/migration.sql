/*
  Warnings:

  - The `status` column on the `subtasks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `checked` on the `tasks` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[key]` on the table `workspaces` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `workspaces` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'DONE', 'DEFERRED', 'ISSUES');

-- CreateEnum
CREATE TYPE "SubtaskStatus" AS ENUM ('IN_PROGRESS', 'DONE', 'DEFERRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('URGENT', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "MemberInviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- AlterTable
ALTER TABLE "subtasks" DROP COLUMN "status",
ADD COLUMN     "status" "SubtaskStatus" NOT NULL DEFAULT 'IN_PROGRESS';

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "checked";

-- AlterTable
ALTER TABLE "workspaces" ADD COLUMN     "key" VARCHAR(50) NOT NULL;

-- CreateTable
CREATE TABLE "workspace_member_invites" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "invitee_id" INTEGER NOT NULL,
    "invited_by" INTEGER NOT NULL,
    "role" "WorkspaceRole" NOT NULL DEFAULT 'EDITOR',
    "status" "MemberInviteStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responded_at" TIMESTAMPTZ(6),

    CONSTRAINT "workspace_member_invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "workspace_member_invites_invitee_id_status_idx" ON "workspace_member_invites"("invitee_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_member_invites_workspace_id_invitee_id_key" ON "workspace_member_invites"("workspace_id", "invitee_id");

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_key_key" ON "workspaces"("key");

-- AddForeignKey
ALTER TABLE "workspace_member_invites" ADD CONSTRAINT "workspace_member_invites_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_member_invites" ADD CONSTRAINT "workspace_member_invites_invitee_id_fkey" FOREIGN KEY ("invitee_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_member_invites" ADD CONSTRAINT "workspace_member_invites_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
