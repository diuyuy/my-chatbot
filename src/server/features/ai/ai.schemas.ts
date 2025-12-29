import { UIMessage } from "ai";
import z from "zod";

export const metadataPart = z.object({
  conversationId: z.uuid(),
  modelProvider: z.string().nonempty(),
});

export type MyMetadataPart = z.infer<typeof metadataPart>;

export type MyUIMessage = UIMessage<MyMetadataPart>;
