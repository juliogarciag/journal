import prisma from "lib/prismaClient";

function moveItemInArray<T>(
  array: Array<T>,
  fromIndex: number,
  toIndex: number
) {
  const item = array[fromIndex];
  const newArray = array.filter((_element, index) => index !== fromIndex);
  newArray.splice(toIndex, 0, item);
  return newArray;
}

async function reorderEntryTypes(currentId: number, newPosition: number) {
  const sortedEntryTypes = await prisma.entryType.findMany({
    select: { id: true, rowOrder: true },
    orderBy: { rowOrder: "asc" },
  });
  const currentPosition = sortedEntryTypes.findIndex(
    (entryType) => entryType.id === currentId
  );
  const sortedIds = sortedEntryTypes.map((entryType) => entryType.id);
  const reorderedIds = moveItemInArray(sortedIds, currentPosition, newPosition);

  const positionUpdates = [];

  reorderedIds.forEach((id, newPosition) => {
    const oldPosition = sortedIds.findIndex((sortedId) => sortedId === id);
    if (oldPosition !== newPosition) {
      positionUpdates.push(
        prisma.entryType.update({
          where: { id },
          data: { rowOrder: newPosition },
        })
      );
    }
  });

  await prisma.$transaction(positionUpdates);
}

export default reorderEntryTypes;
