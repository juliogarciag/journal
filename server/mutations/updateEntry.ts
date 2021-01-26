import expressAsyncHandler from "express-async-handler";
import prisma from "lib/prismaClient";
import { Entry } from "@prisma/client";

export default expressAsyncHandler(async (request, response) => {
  const entryId = Number(request.params.entryId);
  const {
    entry: { value },
  } = request.body;

  const entry = await prisma.entry.findUnique({
    where: { id: entryId },
    include: { entryType: true },
  });
  const entryType = entry.entryType;

  let valueUpdates: Partial<Entry> = {};

  switch (entryType.dataType) {
    case "BOOLEAN":
      valueUpdates.booleanValue = value as boolean;
      break;
    case "QUANTITY":
      valueUpdates.quantityValue = value as number;
      break;
    case "TIME":
      valueUpdates.timeValue = value as string;
      break;
    default:
      break;
  }

  const updatedEntry = await prisma.entry.update({
    where: { id: entryId },
    data: { ...valueUpdates },
  });

  response.json({ entry: updatedEntry });
});
