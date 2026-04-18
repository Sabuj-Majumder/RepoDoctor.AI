-- CreateTable
CREATE TABLE "Scan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "repoUrl" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "repo" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "readmeScore" INTEGER NOT NULL,
    "structureScore" INTEGER NOT NULL,
    "activityScore" INTEGER NOT NULL,
    "maintainabilityScore" INTEGER NOT NULL,
    "bestPracticesScore" INTEGER NOT NULL,
    "report" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Scan_createdAt_idx" ON "Scan"("createdAt");

-- CreateIndex
CREATE INDEX "Scan_overallScore_idx" ON "Scan"("overallScore");
