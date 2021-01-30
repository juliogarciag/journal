import { EntryDataType } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";
import prisma from "lib/prismaClient";

async function getFirstRowPosition() {
  const firstEntryType = await prisma.entryType.findFirst({
    orderBy: { rowOrder: "asc" },
  });

  if (firstEntryType) {
    return firstEntryType.rowOrder;
  } else {
    return 0;
  }
}

export default expressAsyncHandler(async (request, response) => {
  const {
    entryType: { name, icon, dataType },
  } = request.body;

  const newEntryType = await prisma.entryType.create({
    data: {
      name: name as string,
      icon: icon as string,
      dataType: dataType as EntryDataType,
      rowOrder: (await getFirstRowPosition()) - 1,
    },
  });
  response.json({ entryType: newEntryType });
});
