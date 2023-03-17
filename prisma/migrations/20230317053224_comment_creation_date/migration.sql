-- AlterTable
ALTER TABLE "Collection" ALTER COLUMN "thumbnailUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
