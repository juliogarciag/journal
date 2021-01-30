import expressAsyncHandler from "express-async-handler";
import prisma from "lib/prismaClient";
import canEntryTypeBeDeleted from "lib/canEntryTypeBeDeleted";

export default expressAsyncHandler(async (request, response) => {
  response.json({
    canBeDeleted: await canEntryTypeBeDeleted(
      Number(request.params.entryTypeId)
    ),
  });
});
