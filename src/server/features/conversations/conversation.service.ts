import { RESPONSE_STATUS } from "@/constants/response-status";
import { db } from "@/db/db";
import { conversations } from "@/db/schema/schema";
import { CreateMessageDto } from "@/schemas/message.schema";
import { CommonHttpException } from "@/server/common/errors/common-http-exception";
import { createCursor } from "@/server/common/utils/create-cursor";
import { createPaginationResponse } from "@/server/common/utils/response-utils";
import { PaginationOption } from "@/types/types";
import { and, count, eq, gte } from "drizzle-orm/sql";
import { generateStreamText } from "../ai/ai.service";
import { createMessage } from "../messages/message.service";

export const createConversation = async (
  userId: string,
  createConversationDto: CreateMessageDto
) => {
  const [newConversation] = await db
    .insert(conversations)
    .values({ userId, title: createConversationDto.content })
    .returning();

  await createMessage(newConversation.id, createConversationDto);

  return generateStreamText([
    {
      content: createConversationDto.content,
      role: createConversationDto.role,
    },
  ]);
};

export const updateConversation = async (
  userId: string,
  conversationId: string
) => {
  await validateAccessability(userId, conversationId);
};

export const findAllConversations = async (
  userId: string,
  { cursor, limit }: PaginationOption
) => {
  let decodedCursor: Date | null;

  if (!cursor) {
    decodedCursor = null;
  } else {
    const decodedString = Buffer.from(cursor, "base64").toString("utf-8");
    decodedCursor = new Date(decodedString);
  }

  const result = await db
    .select({
      id: conversations.id,
      title: conversations.title,
      createdAt: conversations.createdAt,
      updatedAt: conversations.updatedAt,
    })
    .from(conversations)
    .where(
      and(
        eq(conversations.userId, userId),
        decodedCursor ? gte(conversations.updatedAt, decodedCursor) : undefined
      )
    )
    .orderBy(conversations.updatedAt)
    .limit(limit + 1);

  const nextValue = result.length > limit ? result.at(-1)?.updatedAt : null;
  const nextCursor = nextValue ? createCursor(nextValue.toISOString()) : null;

  const [{ count: totalElements }] = await db
    .select({ count: count() })
    .from(conversations)
    .where(eq(conversations.userId, userId));

  return createPaginationResponse(result, {
    nextCursor,
    totalElements,
    hasNext: !!nextCursor,
  });
};

export const removeConversation = async (
  userId: string,
  conversationId: string
) => {
  // 권한 체크
  await validateAccessability(userId, conversationId);

  await db.delete(conversations).where(eq(conversations.id, conversationId));

  return {
    conversationId,
  };
};

export const validateAccessability = async (
  userId: string,
  conversationId: string
) => {
  const [conversation] = await db
    .select({ userId: conversations.userId })
    .from(conversations)
    .where(eq(conversations.id, conversationId));

  if (!conversation)
    throw new CommonHttpException(RESPONSE_STATUS.CONVERSATION_NOT_FOUND);

  if (conversation.userId !== userId)
    throw new CommonHttpException(RESPONSE_STATUS.ACCESS_CONVERSATION_DENIED);
};
