import { prisma } from "./prisma.js";

export async function createActivity({ userId, action, entityType, entityName }) {
  await prisma.activity.create({
    data: {
      userId,
      action,
      entityType,
      entityName,
    },
  });
}