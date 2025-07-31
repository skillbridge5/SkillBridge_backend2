-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_APPLICATION', 'NEW_STUDENT', 'NEW_COURSE', 'NEW_INSTRUCTOR', 'APPLICATION_APPROVED', 'APPLICATION_REJECTED');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
); 