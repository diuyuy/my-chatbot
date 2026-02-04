import { RESPONSE_STATUS } from "@/constants/response-status";
import { db } from "@/db/db";
import { conversations } from "@/db/schema/schema";
import { CommonHttpException } from "@/server/common/errors/common-http-exception";
import { eq } from "drizzle-orm/sql";

export const validateAccessability = async (
  userId: string,
  conversationId: string,
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
