/*
  Warnings:

  - You are about to drop the column `creativesUrl` on the `Event` table. All the data in the column will be lost.
  - Added the required column `beneficiaries` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schedule` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "creativesUrl",
ADD COLUMN     "beneficiaries" TEXT NOT NULL,
ADD COLUMN     "creativeUrl" TEXT,
ADD COLUMN     "requirements" TEXT,
ADD COLUMN     "schedule" TEXT NOT NULL;
