import { db } from "@/db/db";
import { conversations, favoriteConversations } from "@/db/schema/schema";
import { and, desc, eq } from "drizzle-orm/sql";
import { validateAccessability } from "./guards/validate-accessability";

export const findFavorites = async (userId: string) => {
  const result = await db
    .select({
      id: conversations.id,
      title: conversations.title,
      createdAt: conversations.createdAt,
      updatedAt: conversations.updatedAt,
      favoriteId: favoriteConversations.id,
    })
    .from(conversations)
    .innerJoin(
      favoriteConversations,
      eq(conversations.id, favoriteConversations.conversationId),
    )
    .where(eq(conversations.userId, userId))
    .orderBy(desc(favoriteConversations.createdAt));

  return result.map(({ id, title, createdAt, updatedAt }) => ({
    id,
    title,
    createdAt,
    updatedAt,
    isFavorite: true,
  }));
};

export const addFavoriteConversation = async (
  userId: string,
  conversationId: string,
) => {
  await validateAccessability(userId, conversationId);

  await db
    .insert(favoriteConversations)
    .values({ userId, conversationId })
    .onConflictDoNothing({
      target: [
        favoriteConversations.userId,
        favoriteConversations.conversationId,
      ],
    });
};

export const deleteFavoriteConversation = async (
  userId: string,
  conversationId: string,
) => {
  await db
    .delete(favoriteConversations)
    .where(
      and(
        eq(favoriteConversations.userId, userId),
        eq(favoriteConversations.conversationId, conversationId),
      ),
    );
};
