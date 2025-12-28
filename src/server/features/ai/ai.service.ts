import { google } from "@ai-sdk/google";
import { ModelMessage, streamText, ToolModelMessage } from "ai";

export const generateStreamText = async (
  messages: Exclude<ModelMessage, ToolModelMessage>[]
) => {
  const result = streamText({
    model: google("gemini-2.5-flash"),
    // prompt: "LLM에 대해서 500자 글자로 설명해줘.",
    messages: messages,
  });

  return result.toUIMessageStreamResponse();
};
