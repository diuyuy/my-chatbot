import { db } from "@/db/db";
import { conversations } from "@/db/schema/schema";

export const createConversation = async (userId: string, title: string) => {
  const [newConversation] = await db
    .insert(conversations)
    .values({ userId, title })
    .returning();

  return newConversation;
};

// export const findAllConversations = async (
//   userId: string,
//   { cursor, size }: PaginationOption<Date>
// ) => {
//   const result = await db
//     .select()
//     .from(conversations)
//     .where(
//       and(
//         eq(conversations.userId, userId),
//         cursor ? gt(conversations.updatedAt, cursor) : undefined
//       )
//     )
//     .orderBy(conversations.updatedAt)
//     .limit(size);

//   const [{ count: totalElements }] = await db
//     .select({ count: count() })
//     .from(conversations);
// };
