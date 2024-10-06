import type { User, Story } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Story } from "@prisma/client";

export function getStory({
  id,
  creatorId,
}: Pick<Story, "id"> & {
  creatorId: User["id"];
}) {
  return prisma.story.findFirst({
    select: { id: true, title: true, scenes: true },
    where: { id, creatorId },
  });
}

export function getStoryListItems({ userId }: { userId: User["id"] }) {
  return prisma.story.findMany({
    where: { creatorId: userId },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createStory({
  title,
  userId,
  scenes,
}: Pick<Story, "title" | "scenes"> & {
  userId: User["id"];
}) {
  return prisma.story.create({
    data: {
      title,
      scenes,
      creator: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteStory({
  id,
  userId,
}: Pick<Story, "id"> & { userId: User["id"] }) {
  return prisma.story.deleteMany({
    where: { id, userId },
  });
}

export function updateStory({
  id,
  userId,
  title,
  scenes,
}: Pick<Story, "id"> & {
  userId: User["id"];
  title?: string;  // Optional: can be updated or left undefined
  scenes?: Array<any>; // Replace 'any' with the actual type for scenes if you have one
}) {
  return prisma.story.updateMany({
    where: { id, creatorId: userId },
    data: {
      ...(title && { title }), // Only include title if it's provided
      ...(scenes && { scenes }), // Only include scenes if it's provided
    },
  });
}