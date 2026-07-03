-- CreateTable
CREATE TABLE "user_connectors" (
    "user_id" INTEGER NOT NULL,
    "connector_id" VARCHAR(32) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_connectors_pkey" PRIMARY KEY ("user_id","connector_id")
);

-- CreateIndex
CREATE INDEX "user_connectors_user_id_idx" ON "user_connectors"("user_id");

-- AddForeignKey
ALTER TABLE "user_connectors" ADD CONSTRAINT "user_connectors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
