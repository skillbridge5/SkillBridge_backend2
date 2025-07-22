-- DropForeignKey
ALTER TABLE "StudentApplication" DROP CONSTRAINT "StudentApplication_studentId_fkey";

-- AlterTable
ALTER TABLE "StudentApplication" ALTER COLUMN "studentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "StudentApplication" ADD CONSTRAINT "StudentApplication_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
