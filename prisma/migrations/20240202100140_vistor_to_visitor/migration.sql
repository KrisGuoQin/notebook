/*
  Warnings:

  - You are about to drop the `VistorRecord` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX `LikeRecord_noteId_fkey` ON `LikeRecord`;

-- DropIndex
DROP INDEX `LikeRecord_userId_fkey` ON `LikeRecord`;

-- DropTable
DROP TABLE `VistorRecord`;

-- CreateTable
CREATE TABLE `VisitorRecord` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `noteId` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
