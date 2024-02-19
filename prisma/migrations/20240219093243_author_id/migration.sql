/*
  Warnings:

  - You are about to drop the column `userId` on the `NoteDraft` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `NoteDraft` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `NoteDraft` DROP COLUMN `userId`,
    ADD COLUMN `authorId` VARCHAR(191) NOT NULL;
