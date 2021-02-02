import expressAsyncHandler from "express-async-handler";
import prisma from "lib/prismaClient";

export default expressAsyncHandler(async (_request, response) => {
  const metricTemplates = await prisma.metricTemplate.findMany({
    include: {
      entryType: true,
    },
  });

  response.json({ metricTemplates });
});
