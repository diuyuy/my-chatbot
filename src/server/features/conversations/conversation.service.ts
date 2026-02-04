import { RESPONSE_STATUS } from "@/constants/response-status";
import { db } from "@/db/db";
import { conversations, favoriteConversations } from "@/db/schema/schema";
import { CommonHttpException } from "@/server/common/errors/common-http-exception";
import { createCursor, parseCursor } from "@/server/common/utils/cursor-utils";
import { createPaginationResponse } from "@/server/common/utils/response-utils";
import { PaginationOption } from "@/types/types";
import { TypeValidationError, validateUIMessages } from "ai";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  ilike,
  isNull,
  lt,
} from "drizzle-orm/sql";
import { metadataSchema, MyUIMessage } from "../ai/ai.schemas";
import {
  generateTitle,
  generateUIMessageStreamResponse,
} from "../ai/ai.service";
import {
  findAllMessages,
  insertMessages,
  loadPreviousMessages,
} from "../messages/message.service";
import { findRelevantContent } from "../rags/rag.service";
import { validateAccessability } from "./guards/validate-accessability";

export const handleSentMessage = async (
  userId: string,
  message: MyUIMessage,
  modelProvider: string,
  conversationId: string,
  isRag: boolean,
) => {
  await validateAccessability(userId, conversationId);

  let context: string | undefined;

  if (isRag) {
    const msg = message.parts[0].type === "text" ? message.parts[0].text : "";
    context = await findRelevantContent(msg);
  }

  try {
    const previousMessages = await loadPreviousMessages(conversationId);
    const validatedMessages = await validateUIMessages<MyUIMessage>({
      messages: [...previousMessages, message],
      metadataSchema,
    });

    return generateUIMessageStreamResponse({
      conversationId,
      messages: validatedMessages,
      modelProvider,
      onFinish: async ({ messages }) => {
        await insertMessages(conversationId, messages);
      },
      context,
    });
  } catch (error) {
    if (error instanceof TypeValidationError) {
      console.log("TypeValidation Error Occured");
      throw new CommonHttpException(RESPONSE_STATUS.INVALID_REQUEST_FORMAT);
    } else {
      console.error(error);
      throw new CommonHttpException(RESPONSE_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
};

export const createConversation = async (userId: string, message: string) => {
  const title = generateTitle(message);

  const [newConversation] = await db
    .insert(conversations)
    .values({ userId, title })
    .returning();

  return newConversation.id;
};

export const updateConversationTitle = async (
  conversationId: string,
  title: string,
  shouldValidate?: boolean,
  userId?: string,
) => {
  if (shouldValidate && userId)
    await validateAccessability(userId, conversationId);

  await db
    .update(conversations)
    .set({ title })
    .where(eq(conversations.id, conversationId));
};

export const findAllConversations = async (
  userId: string,
  {
    cursor,
    limit,
    direction,
    includeFavorite,
    filter,
  }: PaginationOption & { includeFavorite?: boolean; filter?: string },
) => {
  const decodedCursor = cursor ? parseCursor(cursor, "date") : null;

  const whereCondition = and(
    eq(conversations.userId, userId),
    !includeFavorite ? isNull(favoriteConversations.id) : undefined,
    filter ? ilike(conversations.title, `%${filter}%`) : undefined,
  );

  const result = await db
    .select({
      id: conversations.id,
      title: conversations.title,
      createdAt: conversations.createdAt,
      updatedAt: conversations.updatedAt,
      favoriteId: favoriteConversations.id,
    })
    .from(conversations)
    .leftJoin(
      favoriteConversations,
      eq(conversations.id, favoriteConversations.conversationId),
    )
    .where(
      and(
        whereCondition,
        decodedCursor
          ? direction === "desc"
            ? lt(conversations.updatedAt, decodedCursor)
            : gt(conversations.updatedAt, decodedCursor)
          : undefined,
      ),
    )
    .orderBy(
      direction === "desc"
        ? desc(conversations.updatedAt)
        : asc(conversations.updatedAt),
    )
    .limit(limit + 1);

  const [counts] = await db
    .select({
      count: count(),
    })
    .from(conversations)
    .leftJoin(
      favoriteConversations,
      eq(conversations.id, favoriteConversations.conversationId),
    )
    .where(whereCondition);

  const totalElements = counts ? counts.count : 0;

  let lastValue: Date | undefined;

  if (result.length > limit) {
    result.pop();
    lastValue = result.at(-1)?.updatedAt;
  }

  const nextCursor = lastValue ? createCursor(lastValue) : null;

  const items = result.map(({ favoriteId, ...conversation }) => ({
    ...conversation,
    isFavorite: !!favoriteId,
  }));

  return createPaginationResponse(items, {
    nextCursor,
    totalElements,
    hasNext: !!nextCursor,
  });
};

export const findConversationById = async (
  userId: string,
  conversationId: string,
) => {
  await validateAccessability(userId, conversationId);

  const [result] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId));

  return result;
};

export const getMessagesInConversation = async (
  userId: string,
  conversationId: string,
  paginationOption: PaginationOption,
) => {
  await validateAccessability(userId, conversationId);

  return findAllMessages(conversationId, paginationOption);
};

export const removeConversation = async (
  userId: string,
  conversationId: string,
) => {
  // 권한 체크
  await validateAccessability(userId, conversationId);

  await db.delete(conversations).where(eq(conversations.id, conversationId));

  return {
    conversationId,
  };
};
