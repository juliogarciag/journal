import { MetricType } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";
import prisma from "lib/prismaClient";

export default expressAsyncHandler(async (request, response) => {
  const {
    metricTemplate: { metricType, entryTypeId },
  } = request.body;

  const newMetricType = await prisma.metricTemplate.create({
    data: {
      metricType: metricType as MetricType,
      entryTypeId: entryTypeId as number,
    },
  });
  response.json({ metricType: newMetricType });
});
