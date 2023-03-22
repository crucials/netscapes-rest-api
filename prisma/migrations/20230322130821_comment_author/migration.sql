/*
  Warnings:

  - You are about to drop the column `authorUsername` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `authorAccountId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "authorUsername",
ADD COLUMN     "authorAccountId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorAccountId_fkey" FOREIGN KEY ("authorAccountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
