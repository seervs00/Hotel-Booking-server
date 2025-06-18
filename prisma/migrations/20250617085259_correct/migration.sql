/*
  Warnings:

  - You are about to drop the column `CheckInDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `CheckOutDate` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `checkInDate` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkOutDate` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "CheckInDate",
DROP COLUMN "CheckOutDate",
ADD COLUMN     "checkInDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "checkOutDate" TIMESTAMP(3) NOT NULL;
