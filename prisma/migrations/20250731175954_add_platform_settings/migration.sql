-- CreateTable
CREATE TABLE "PlatformSettings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'SkillBridge',
    "contactEmail" TEXT NOT NULL DEFAULT 'contact@skillbridge.com',
    "siteDescription" TEXT NOT NULL DEFAULT 'Bridging Gaps, Building Skills, Transforming Futures',
    "contactPhone" TEXT NOT NULL DEFAULT '+251 2345 4365',
    "address" TEXT NOT NULL DEFAULT '123 Education Street, Learning City',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformSettings_pkey" PRIMARY KEY ("id")
);
