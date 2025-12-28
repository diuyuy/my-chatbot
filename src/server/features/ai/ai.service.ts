import { ClientMessage } from "@/types/types";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const generateStreamText = async (messages: ClientMessage[]) => {
  return streamText({
    model: google("gemini-2.5-flash"),
    // prompt: "LLM에 대해서 500자 글자로 설명해줘.",
    messages: messages,
  });
};
