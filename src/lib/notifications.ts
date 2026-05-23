import { prisma } from "./prisma";

export async function createNotification(data: {
  type: string;
  title: string;
  message: string;
  link?: string;
  userId?: string;
}) {
  return prisma.notification.create({ data });
}
