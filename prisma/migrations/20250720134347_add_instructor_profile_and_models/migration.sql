/*
  Warnings:

  - You are about to drop the `StudentApplication` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "InstructorStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- DropForeignKey
ALTER TABLE "StudentApplication" DROP CONSTRAINT "StudentApplication_courseId_fkey";

-- DropForeignKey
ALTER TABLE "StudentApplication" DROP CONSTRAINT "StudentApplication_studentId_fkey";

-- AlterTable
ALTER TABLE "InstructorProfile" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "status" "InstructorStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "students" INTEGER,
ADD COLUMN     "yearsOfExperience" INTEGER;

-- DropTable
DROP TABLE "StudentApplication";

-- DropEnum
DROP TYPE "ApplicationStatus";

-- DropEnum
DROP TYPE "PaymentMethod";

-- CreateTable
CREATE TABLE "Expertise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Expertise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstructorExpertise" (
    "id" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "expertiseId" TEXT NOT NULL,

    CONSTRAINT "InstructorExpertise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Expertise_name_key" ON "Expertise"("name");

-- AddForeignKey
ALTER TABLE "InstructorExpertise" ADD CONSTRAINT "InstructorExpertise_expertiseId_fkey" FOREIGN KEY ("expertiseId") REFERENCES "Expertise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstructorExpertise" ADD CONSTRAINT "InstructorExpertise_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "InstructorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
