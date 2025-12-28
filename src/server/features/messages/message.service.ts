import { db } from "@/db/db";
import { messages } from "@/db/schema/schema";
import { CreateMessageDto } from "@/schemas/message.schema";

export const createMessage = async (
  conversationId: string,
  createMessageDto: CreateMessageDto
) => {
  const [newMessage] = await db
    .insert(messages)
    .values({
      conversationId,
      ...createMessageDto,
    })
    .returning();

  return newMessage;
};
