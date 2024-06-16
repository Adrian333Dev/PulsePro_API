import { Prisma } from "@prisma/client";

export const userProfileQuery: Prisma.UserSelect = {
  userId: true,
  email: true,
  role: true,
  org: true,
};
