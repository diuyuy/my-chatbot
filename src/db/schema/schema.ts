import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  vector,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

// Enums
export const messageRoleEnum = pgEnum("message_role", [
  "user",
  "assistant",
  "system",
  "tool",
]);
export const fileTypeEnum = pgEnum("file_type", ["image", "audio", "pdf"]);

// Tables
export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  role: messageRoleEnum("role").notNull(),
  content: text("content"),
  modelProvider: text("model_provider"),
  tokenUsed: integer("token_used"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messageAttachments = pgTable("message_attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  messageId: uuid("message_id")
    .notNull()
    .references(() => messages.id, { onDelete: "cascade" }),
  fileType: fileTypeEnum("file_type").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  fileName: text("file_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const toolInvocations = pgTable("tool_invocations", {
  id: uuid("id").primaryKey().defaultRandom(),
  messageId: uuid("message_id")
    .notNull()
    .references(() => messages.id, { onDelete: "cascade" }),
  toolName: text("tool_name").notNull(),
  arguments: jsonb("arguments"),
  output: jsonb("output"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const documentChunks = pgTable("document_chunks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  tag: text("tag"), // 문서 필터링 용 태그
  embedding: vector("embedding", { dimensions: 1536 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
