import expressAsyncHandler from "express-async-handler";
import prisma from "lib/prismaClient";

export default expressAsyncHandler(async (request, response) => {
  const metricTemplateId = Number(request.params.metricTemplateId);
  await prisma.metricTemplate.delete({ where: { id: metricTemplateId } });
  response.status(204).json({ ok: true });
});
