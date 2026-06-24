-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'CASHIER';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "employer_id" UUID;

-- CreateIndex
CREATE INDEX "balances_user_id_idx" ON "balances"("user_id");

-- CreateIndex
CREATE INDEX "balances_merchant_id_idx" ON "balances"("merchant_id");

-- CreateIndex
CREATE INDEX "transactions_merchant_id_idx" ON "transactions"("merchant_id");

-- CreateIndex
CREATE INDEX "transactions_timestamp_idx" ON "transactions"("timestamp");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_employer_id_fkey" FOREIGN KEY ("employer_id") REFERENCES "merchants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
