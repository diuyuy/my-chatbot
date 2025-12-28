import { messageRoleEnum } from "@/db/schema/enums";
import z from "zod";

export const MessageSchema = z.object({
  content: z.string().nonempty(),
  role: z.enum([messageRoleEnum.enumValues[0], messageRoleEnum.enumValues[1]]),
  modelProvider: z.string().nonempty(),
});

export const UserMessageSchema = MessageSchema;

export type CreateMessageDto = z.infer<typeof UserMessageSchema>;
export type UpdateConversationDto = z.infer<typeof MessageSchema>[];
