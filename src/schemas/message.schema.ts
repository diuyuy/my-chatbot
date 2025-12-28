import { messageRoleEnum } from "@/db/schema/enums";
import z from "zod";

export const AIMessageSchema = z.object({
  content: z.string().nonempty(),
  role: z.enum([
    messageRoleEnum.enumValues[0],
    messageRoleEnum.enumValues[1],
    messageRoleEnum.enumValues[2],
  ]),
  modelProvider: z.string().nonempty(),
});

export const UserMessageSchema = AIMessageSchema;

export type CreateMessageDto = z.infer<typeof UserMessageSchema>;
