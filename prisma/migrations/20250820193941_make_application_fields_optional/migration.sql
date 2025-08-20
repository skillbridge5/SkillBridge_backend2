-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('OPEN', 'CLOSED');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "enrollmentStatus" "EnrollmentStatus" NOT NULL DEFAULT 'CLOSED';

-- AlterTable
ALTER TABLE "StudentApplication" ALTER COLUMN "paymentReference" DROP NOT NULL,
ALTER COLUMN "dateOfBirth" DROP NOT NULL;
