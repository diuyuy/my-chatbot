import { pgEnum } from "drizzle-orm/pg-core";

// Enums
export const messageRoleEnum = pgEnum("message_role", [
  "user",
  "assistant",
  "system",
  "tool",
]);

export type MessageRole = (typeof messageRoleEnum.enumValues)[number];

export const fileTypeEnum = pgEnum("file_type", ["image", "audio", "pdf"]);
