-- DropIndex
DROP INDEX "Room_hotelId_key";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
