/*
  Warnings:

  - You are about to drop the `PicturesInCollections` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PicturesInCollections" DROP CONSTRAINT "PicturesInCollections_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "PicturesInCollections" DROP CONSTRAINT "PicturesInCollections_pictureId_fkey";

-- DropTable
DROP TABLE "PicturesInCollections";

-- CreateTable
CREATE TABLE "_CollectionToPicture" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CollectionToPicture_AB_unique" ON "_CollectionToPicture"("A", "B");

-- CreateIndex
CREATE INDEX "_CollectionToPicture_B_index" ON "_CollectionToPicture"("B");

-- AddForeignKey
ALTER TABLE "_CollectionToPicture" ADD CONSTRAINT "_CollectionToPicture_A_fkey" FOREIGN KEY ("A") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToPicture" ADD CONSTRAINT "_CollectionToPicture_B_fkey" FOREIGN KEY ("B") REFERENCES "Picture"("id") ON DELETE CASCADE ON UPDATE CASCADE;
