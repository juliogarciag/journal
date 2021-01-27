import expressAsyncHandler from "express-async-handler";
import prisma from "lib/prismaClient";

export default expressAsyncHandler(async (_request, response) => {
  const entryTypes = await prisma.entryType.findMany({
    orderBy: [{ rowOrder: "asc" }],
  });

  response.json({
    entryTypes: entryTypes.map((entryType) => ({
      ...entryType,
      rowOrderPosition: entryType.rowOrder,
    })),
  });
});
