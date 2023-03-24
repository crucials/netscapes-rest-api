-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_targetPictureId_fkey";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_targetPictureId_fkey" FOREIGN KEY ("targetPictureId") REFERENCES "Picture"("id") ON DELETE CASCADE ON UPDATE CASCADE;
