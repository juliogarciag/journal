import { MetricType } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";
import prisma from "lib/prismaClient";

export default expressAsyncHandler(async (request, response) => {
  const {
    metricTemplate: { entryTypeId, metricType },
  } = request.body;

  const metricTemplateId = Number(request.params.metricTemplateId);

  const metricTemplate = await prisma.metricTemplate.update({
    data: {
      entryTypeId: entryTypeId as number,
      metricType: metricType as MetricType,
    },
    where: { id: metricTemplateId },
  });

  response.json(metricTemplate);
});
