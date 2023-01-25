/*
  Warnings:

  - You are about to drop the column `userId` on the `UserOTP` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userEmail]` on the table `UserOTP` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userEmail` to the `UserOTP` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserOTP" DROP CONSTRAINT "UserOTP_userId_fkey";

-- DropIndex
DROP INDEX "UserOTP_userId_key";

-- AlterTable
ALTER TABLE "UserOTP" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserOTP_userEmail_key" ON "UserOTP"("userEmail");

-- AddForeignKey
ALTER TABLE "UserOTP" ADD CONSTRAINT "UserOTP_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
