import { EntryDataType } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";
import prisma from "lib/prismaClient";
import reorderEntryTypes from "lib/reorderEntryTypes";

export default expressAsyncHandler(async (request, response) => {
  const {
    entryType: { name, icon, dataType },
  } = request.body;

  const newEntryType = await prisma.entryType.create({
    data: {
      name: name as string,
      icon: icon as string,
      dataType: dataType as EntryDataType,
    },
  });
  await reorderEntryTypes(newEntryType.id, 0);
  response.json({ entryType: newEntryType });
});
