import expressAsyncHandler from "express-async-handler";
import prisma from "lib/prismaClient";
import reorderEntryTypes from "lib/reorderEntryTypes";

export default expressAsyncHandler(async (request, response) => {
  const {
    entryType: { dataType, name, rowOrderPosition, icon },
  } = request.body;

  const entryTypeId = Number(request.params.entryTypeId);

  const entryTypeUpdate = prisma.entryType.update({
    data: { dataType, name, icon },
    where: { id: entryTypeId },
  });

  if (rowOrderPosition !== undefined) {
    await reorderEntryTypes(entryTypeId, rowOrderPosition);
  } else {
    await entryTypeUpdate;
  }

  const updatedEntryType = await prisma.entryType.findUnique({
    where: { id: entryTypeId },
  });

  response.json(updatedEntryType);
});
