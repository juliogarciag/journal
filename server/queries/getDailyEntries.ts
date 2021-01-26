import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";
import { difference, sortBy, pick } from "lodash";
import { DateTime } from "luxon";
import prisma from "lib/prismaClient";
import { Entry, EntryType } from "@prisma/client";

async function loadCurrentEntries(day: Date) {
  return await prisma.entry.findMany({
    where: { day },
    include: { entryType: true },
  });
}

function mapAndSort<T>(collection: Array<T>, property: string) {
  return collection.map((entryType) => entryType[property]).sort();
}

interface EntryWithType extends Entry {
  entryType: EntryType;
}

function sortEntries(entries: Array<EntryWithType>) {
  return sortBy(entries, (entry) => entry.entryType.rowOrder);
}

async function findMissingEntryTypeIds(entries: Array<Entry>) {
  const entryTypes = await prisma.entryType.findMany({
    orderBy: [{ rowOrder: "asc" }],
  });
  const allEntryTypeIds = mapAndSort(entryTypes, "id");
  const currentEntryTypeIds = mapAndSort(entries, "entryTypeId");
  return difference(allEntryTypeIds, currentEntryTypeIds);
}

function getEntryValue(entry: EntryWithType) {
  switch (entry.entryType.dataType) {
    case "BOOLEAN":
      return entry.booleanValue;
    case "QUANTITY":
      return entry.quantityValue;
    case "TIME":
      return entry.timeValue;
    default:
      return null;
  }
}

export default expressAsyncHandler(async (request, response) => {
  const day = DateTime.fromISO(request.params.day).toJSDate();

  let currentEntries = await loadCurrentEntries(day);

  const missingEntryTypeIds = await findMissingEntryTypeIds(currentEntries);

  if (missingEntryTypeIds.length > 0) {
    for (const missingEntryTypeId of missingEntryTypeIds) {
      await prisma.entry.create({
        data: { entryTypeId: missingEntryTypeId, day },
      });
      currentEntries = await loadCurrentEntries(day);
    }
  }

  response.json({
    entries: sortEntries(currentEntries).map((entry) => {
      return { ...entry, value: getEntryValue(entry) };
    }),
  });
});
