import expressAsyncHandler from "express-async-handler";
import canEntryTypeBeDeleted from "lib/canEntryTypeBeDeleted";
import prisma from "lib/prismaClient";

export default expressAsyncHandler(async (request, response) => {
  const entryTypeId = Number(request.params.entryTypeId);
  const canBeDeleted = await canEntryTypeBeDeleted(entryTypeId);

  if (canBeDeleted) {
    const deleteEntries = prisma.entry.deleteMany({
      where: { entryTypeId: entryTypeId },
    });
    const deleteMetricTemplates = prisma.metricTemplate.deleteMany({
      where: { entryTypeId: entryTypeId },
    });
    const deleteEntryType = prisma.entryType.delete({
      where: { id: entryTypeId },
    });

    await prisma.$transaction([
      deleteEntries,
      deleteMetricTemplates,
      deleteEntryType,
    ]);
  }

  response.status(204).json({ ok: canBeDeleted });
});
