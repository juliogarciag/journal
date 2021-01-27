import expressAsyncHandler from "express-async-handler";
import prisma from "lib/prismaClient";

export default expressAsyncHandler(async (request, response) => {
  const undeletableEntriesCount = await prisma.entry.count({
    where: {
      AND: {
        entryTypeId: Number(request.params.entryTypeId),
        OR: [
          { NOT: { booleanValue: null } },
          { NOT: { quantityValue: null } },
          { NOT: { timeValue: null } },
        ],
      },
    },
  });

  const canBeDeleted = undeletableEntriesCount === 0;

  response.json({ canBeDeleted });
});
