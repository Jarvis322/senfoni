/*
  Warnings:

  - You are about to drop the `LayoutSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "LayoutSettings";

-- CreateTable
CREATE TABLE "layout_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "heroSection" JSONB NOT NULL,
    "featuredProducts" JSONB NOT NULL,
    "categories" JSONB NOT NULL,
    "aboutSection" JSONB NOT NULL,
    "contactInfo" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "layout_settings_pkey" PRIMARY KEY ("id")
);
