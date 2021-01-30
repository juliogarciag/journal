import expressAsyncHandler from "express-async-handler";
import canEntryTypeBeDeleted from "lib/canEntryTypeBeDeleted";
import prisma from "lib/prismaClient";

export default expressAsyncHandler(async (request, response) => {
  const entryTypeId = Number(request.params.entryTypeId);
  const canBeDeleted = await canEntryTypeBeDeleted(entryTypeId);

  if (canBeDeleted) {
    await prisma.entryType.delete({ where: { id: entryTypeId } });
  }

  response.status(204).json({ ok: canBeDeleted });
});
