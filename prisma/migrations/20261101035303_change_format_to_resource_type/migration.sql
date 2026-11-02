/*
  Warnings:

  - You are about to drop the column `format` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "format",
ADD COLUMN     "resource_type" TEXT;
