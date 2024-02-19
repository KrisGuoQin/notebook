/*
  Warnings:

  - You are about to drop the column `pv` on the `Note` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `LikeRecord` DROP FOREIGN KEY `LikeRecord_noteId_fkey`;

-- DropForeignKey
ALTER TABLE `LikeRecord` DROP FOREIGN KEY `LikeRecord_userId_fkey`;

-- DropForeignKey
ALTER TABLE `VistorRecord` DROP FOREIGN KEY `VistorRecord_noteId_fkey`;

-- DropForeignKey
ALTER TABLE `VistorRecord` DROP FOREIGN KEY `VistorRecord_userId_fkey`;

-- AlterTable
ALTER TABLE `Note` DROP COLUMN `pv`;
