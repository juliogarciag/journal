-- CreateEnum
CREATE TYPE "EntryDataType" AS ENUM ('BOOLEAN', 'TIME', 'QUANTITY');

-- CreateEnum
CREATE TYPE "MetricType" AS ENUM ('PROPORTION', 'AVERAGE');

-- CreateTable
CREATE TABLE "EntryType" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dataType" "EntryDataType" NOT NULL,
    "name" TEXT NOT NULL,
    "rowOrder" INTEGER NOT NULL,
    "icon" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entry" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "booleanValue" BOOLEAN,
    "timeValue" TEXT,
    "quantityValue" INTEGER,
    "entryTypeId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetricTemplate" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metricType" "MetricType" NOT NULL,
    "entryTypeId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EntryType.rowOrder_unique" ON "EntryType"("rowOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Entry.day_entryTypeId_unique" ON "Entry"("day", "entryTypeId");

-- AddForeignKey
ALTER TABLE "Entry" ADD FOREIGN KEY ("entryTypeId") REFERENCES "EntryType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetricTemplate" ADD FOREIGN KEY ("entryTypeId") REFERENCES "EntryType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
