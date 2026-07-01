-- CreateTable
CREATE TABLE "user_llm_settings" (
    "user_id" INTEGER NOT NULL,
    "api_key_encrypted" TEXT NOT NULL,
    "key_hint" VARCHAR(8),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_llm_settings_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "user_llm_settings" ADD CONSTRAINT "user_llm_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
