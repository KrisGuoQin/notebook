/*
  Warnings:

  - Added the required column `updateAt` to the `BrowseRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `BrowseRecord` ADD COLUMN `updateAt` DATETIME(3) NOT NULL;
