/*
  Warnings:

  - A unique constraint covering the columns `[ownerId]` on the table `Hotel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Rooms" (
    "id" SERIAL NOT NULL,
    "roomType" TEXT NOT NULL,
    "priceParNight" TEXT NOT NULL,
    "amenities" TEXT[],
    "images" TEXT[],
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "Rooms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rooms_roomId_key" ON "Rooms"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "Hotel_ownerId_key" ON "Hotel"("ownerId");

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "Rooms_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
