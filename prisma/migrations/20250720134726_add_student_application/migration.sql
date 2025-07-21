-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('TELEBIRR', 'CBE', 'AMOLE', 'OTHER');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "StudentApplication" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "paymentReference" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "adminNotes" TEXT,
    "marketingSource" TEXT,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "nationality" TEXT,
    "university" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "telegramHandle" TEXT,
    "address" TEXT,
    "receiptUrl" TEXT,
    "receiptVerified" BOOLEAN NOT NULL DEFAULT false,
    "paymentOption" TEXT,

    CONSTRAINT "StudentApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StudentApplication_studentId_idx" ON "StudentApplication"("studentId");

-- CreateIndex
CREATE INDEX "StudentApplication_courseId_idx" ON "StudentApplication"("courseId");

-- AddForeignKey
ALTER TABLE "StudentApplication" ADD CONSTRAINT "StudentApplication_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentApplication" ADD CONSTRAINT "StudentApplication_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
