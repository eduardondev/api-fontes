/*
  Warnings:

  - You are about to drop the column `name` on the `Projects` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Projects` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `Projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Projects" DROP CONSTRAINT "Projects_user_id_fkey";

-- AlterTable
ALTER TABLE "Projects" DROP COLUMN "name",
DROP COLUMN "user_id",
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_username_fkey" FOREIGN KEY ("username") REFERENCES "Users"("username") ON DELETE CASCADE ON UPDATE CASCADE;
