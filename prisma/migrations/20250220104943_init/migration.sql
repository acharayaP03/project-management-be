/*
  Warnings:

  - You are about to drop the column `projectMangerUserId` on the `Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "projectMangerUserId",
ADD COLUMN     "projectManagerUserId" INTEGER;
