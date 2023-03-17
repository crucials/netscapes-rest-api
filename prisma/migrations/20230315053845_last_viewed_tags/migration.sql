/*
  Warnings:

  - You are about to drop the column `pictureUrl` on the `Picture` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `Picture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "lastViewedTags" TEXT[];

-- AlterTable
ALTER TABLE "Picture" DROP COLUMN "pictureUrl",
ADD COLUMN     "imageUrl" TEXT NOT NULL;
