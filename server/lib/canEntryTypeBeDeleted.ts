import prisma from "lib/prismaClient";

async function canEntryTypeBeDeleted(entryTypeId: number) {
  const undeletableEntriesCount = await prisma.entry.count({
    where: {
      AND: {
        entryTypeId,
        OR: [
          { NOT: { booleanValue: null } },
          { NOT: { quantityValue: null } },
          { NOT: { timeValue: null } },
        ],
      },
    },
  });

  return undeletableEntriesCount === 0;
}

export default canEntryTypeBeDeleted;
